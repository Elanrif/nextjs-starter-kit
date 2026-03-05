import { NextRequest, NextResponse } from "next/server";
import { CategoryCreate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { CrudApiError, crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import {
  createCategory,
  fetchCategories,
} from "@/lib/categories/services/category.service";
import { verifySession } from "@/lib/auth/session/dal";

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

    if ("error" in categories) {
      const error = categories as CrudApiError;
      reqLogger.error("Failed to fetch categories", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategories");
    const status = errMsg.status || 500;
    logger.error("Error during category fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
export async function POST(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

  // User authentication and role verification
  const session = await verifySession();

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return new Response(null, { status: status });
  }

  // Check if the user has the 'admin' role
  if (session.role !== "ADMIN") {
    // User is authenticated but does not have the right permissions
    const status = 403;
    const message = "You do not have permission to perform this action";
    reqLogger.error("Forbidden", { status, message });
    return new Response(null, { status : status });
  }

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

    if ("error" in category) {
      const error = category as CrudApiError;
      reqLogger.error("Failed to create category", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    reqLogger.info("Category created", { categoryId: category.id });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createCategory");
    const status = errMsg.status || 500;
    logger.error("Error during category creation", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
