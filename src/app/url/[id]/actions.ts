"use server";

import { db } from "@/db";
import { analyticsTable, shortUrlTable } from "@/db/schema";
import { validateRequest } from "@/lib/validate-request";

import { eq, count } from "drizzle-orm";
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

export async function getAnalytics(shortUrlId: string) {
	const analytics = await db
		.select()
		.from(analyticsTable)
		.where(eq(analyticsTable.shortUrlId, shortUrlId));

	const totalClicks = analytics.length;
	const countries = analytics.map((a) => a.country);
	const cities = analytics.map((a) => a.city);

	return {
		totalClicks,
		countries,
		cities,
	};
}
