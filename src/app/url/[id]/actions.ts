"use server";

import { db } from "@/db";
import { shortUrlTable } from "@/db/schema";
import { validateRequest } from "@/lib/validate-request";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function getShortUrl(id: string) {
	const { session } = await validateRequest();
	if (!session) {
		return redirect("/");
	}

	try {
		const shortUrl = await db.query.shortUrlTable.findFirst({
			where: eq(shortUrlTable.id, id),
		});

		return shortUrl;
	} catch (error) {
		console.error("Error fetching short URL:", error);
		return redirect("/");
	}
}
