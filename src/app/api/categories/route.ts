import { NextRequest, NextResponse } from "next/server";
import { CategoryCreate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";
import {
  createCategory,
  fetchCategories,
} from "@/lib/categories/services/category.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Fetch all product categories
 */
export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const categories = await fetchCategories(config);

    if ("statusCode" in categories) {
      const error = categories as CrudApiError;
      reqLogger.error("Failed to fetch categories", {
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(categories, { status: 200 });
  } catch {
    const status = 500;
    const message = "Could not fetch categories";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json({ message }, { status });
  }
}

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
export async function POST(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

  // // Check authentication
  // const session = await getServerSession(request);

  // if (!session?.user) {
  //   const status = 401;
  //   const message = "You must be logged in";
  //   reqLogger.error("Unauthorized", { status, message });
  //   return NextResponse.json({ message }, { status });
  // }

  const body = (await request.json()) as CategoryCreate;

  // Validate required fields
  if (!body?.name) {
    const status = 400;
    const message = "Field `name` is required";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const category = await createCategory(config, body);

    if ("statusCode" in category) {
      const error = category as CrudApiError;
      reqLogger.error("Failed to create category", {
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    reqLogger.info("Category created", { categoryId: category.id });
    return NextResponse.json(category, { status: 201 });
  } catch {
    const status = 500;
    const message = "Could not create category";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json({ message }, { status });
  }
}
