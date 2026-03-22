import { NextRequest, NextResponse } from "next/server";
import { CategoryCreate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import { createCategory, fetchCategories } from "@/lib/categories/services/category.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Fetch all product categories
 *
 * ℹ️ Pattern: returns unwrapped T | CrudApiError (contrast with /api/users which returns Result<T,E>)
 * The client service uses an `isCrudError()` type guard to distinguish success from error.
 */
export async function GET(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategories(config);

    if (!response.ok) {
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    return NextResponse.json(response.data, {
      status: 200,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategories");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category fetching");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * POST /api/categories
 * Create a new category (requires authentication)
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as CategoryCreate;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await createCategory(config, body);

    if (!response.ok) {
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    logger.info({ categoryId: response.data.id }, "Category created");
    return NextResponse.json(response.data, {
      status: 201,
    });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category creation");
    return NextResponse.json(errMsg, { status });
  }
}
