"use server";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateRequest } from "@/lib/validate-request";
import * as cheerio from "cheerio";
import { db } from "@/db";
import { shortUrlTable } from "@/db/schema";
import { generateIdFromEntropySize } from "lucia";

export async function logout() {
	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/login");
}

export async function shortenUrl(formData: FormData) {
	const url = formData.get("url") as string;

	const { session } = await validateRequest();
	if (!session) {
		return {
			error: "Unauthorized",
		};
	}

	const shortCode = generateIdFromEntropySize(6);

	// Getting title from URL
	let title = "";
	try {
		const response = await fetch(url, { method: "GET" });
		const html = await response.text();
		const $ = cheerio.load(html);
		title = $("title").text().trim();
	} catch (error) {
		console.error("Error fetching URL title:", error);
		title = url; // Use the URL as title if fetching fails
	}

	const shortUrlTableId = generateIdFromEntropySize(16);

	await db.insert(shortUrlTable).values({
		id: shortUrlTableId,
		originalUrl: url,
		shortCode,
		title,
	});

	return redirect(`/url/${shortUrlTableId}`);
}
