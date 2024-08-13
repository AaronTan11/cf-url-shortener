"use server";
import { db } from "@/db";
import { argon2id } from "@noble/hashes/argon2";

import { bytesToHex as toHex, randomBytes } from "@noble/hashes/utils";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { userTable } from "@/db/schema";

import type { ActionResult } from "@/components/custom/form";

export async function signup(formData: FormData): Promise<ActionResult> {
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
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

	const salt = randomBytes(16);

	const passwordHashUint8Array = argon2id(password, salt, {
		// recommended minimum parameters
		t: 2,
		m: 19456,
		p: 1,
	});

	const passwordHash = `$argon2id$v=19$m=19456,t=2,p=1$${toHex(salt)}$${toHex(
		passwordHashUint8Array
	)}`;

	const userId = generateIdFromEntropySize(10); // 16 characters long

	// TODO: check if username is already used
	await db.insert(userTable).values({
		id: userId,
		username: username,
		password_hash: passwordHash,
	});

	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/");
}
