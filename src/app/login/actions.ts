"use server";
import { argon2id } from "@noble/hashes/argon2";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";

import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ActionResult } from "@/components/custom/form";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

function verifyPassword(storedHash: string, inputPassword: string): boolean {
	const [, , v, params, salt, hash] = storedHash.split("$");
	const [m, t, p] = params.split(",");
	const memory = parseInt(m.split("=")[1]);
	const time = parseInt(t.split("=")[1]);
	const parallelism = parseInt(p.split("=")[1]);

	const saltBytes = hexToBytes(salt);
	const hashBytes = hexToBytes(hash);

	const newHash = argon2id(inputPassword, saltBytes, {
		t: time,
		m: memory,
		p: parallelism,
		dkLen: hashBytes.length,
	});

	return bytesToHex(newHash) === hash;
}

export async function login(formData: FormData): Promise<ActionResult> {
	const username = formData.get("username");
	if (
		typeof username !== "string" ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return {
			error: "Invalid username",
		};
	}
	const password = formData.get("password");
	if (typeof password !== "string" || password.length < 6 || password.length > 255) {
		return {
			error: "Invalid password",
		};
	}

	const existingUser = await db.query.userTable.findFirst({
		where: eq(userTable.username, username.toLowerCase()),
	});
	if (!existingUser) {
		// NOTE:
		// Returning immediately allows malicious actors to figure out valid usernames from response times,
		// allowing them to only focus on guessing passwords in brute-force attacks.
		// As a preventive measure, you may want to hash passwords even for invalid usernames.
		// However, valid usernames can be already be revealed with the signup page among other methods.
		// It will also be much more resource intensive.
		// Since protecting against this is non-trivial,
		// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
		// If usernames are public, you may outright tell the user that the username is invalid.
		return {
			error: "Incorrect username or password",
		};
	}

	const validPassword = verifyPassword(existingUser.password_hash, password);

	if (!validPassword) {
		return {
			error: "Incorrect username or password",
		};
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}
