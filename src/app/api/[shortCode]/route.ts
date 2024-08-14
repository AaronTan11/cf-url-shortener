import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { shortUrlTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
	const shortCode = params.shortCode;

	try {
		const shortUrl = await db.query.shortUrlTable.findFirst({
			where: eq(shortUrlTable.shortCode, shortCode),
		});

		if (shortUrl) {
			return NextResponse.redirect(shortUrl.originalUrl);
		} else {
			return NextResponse.redirect(new URL("/404", request.url));
		}
	} catch (error) {
		console.error("Error fetching short URL:", error);
		return NextResponse.redirect(new URL("/500", request.url));
	}
}
