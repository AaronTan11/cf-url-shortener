import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shortUrlTable, analyticsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

export const runtime = "edge";

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
	const shortCode = params.shortCode;

	try {
		const shortUrl = await db.query.shortUrlTable.findFirst({
			where: eq(shortUrlTable.shortCode, shortCode),
		});

		if (shortUrl) {
			// Only log the analytics if the request is not from the details page
			if (!request.headers.get("Referer")?.includes(`/url/${shortUrl.id}`)) {
				const analyticsId = generateIdFromEntropySize(16);
				await db.insert(analyticsTable).values({
					id: analyticsId,
					shortUrlId: shortUrl.id,
					clickedAt: Date.now(),
					country: request.geo?.country || null,
					city: request.geo?.city || null,
				});
			}

			return NextResponse.redirect(shortUrl.originalUrl);
		} else {
			return NextResponse.redirect(new URL("/404", request.url));
		}
	} catch (error) {
		console.error("Error fetching short URL:", error);
		return NextResponse.redirect(new URL("/500", request.url));
	}
}
