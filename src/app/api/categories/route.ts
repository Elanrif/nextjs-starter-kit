import { NextRequest, NextResponse } from "next/server";
import { CategoryCreate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import {
  createCategory,
  fetchCategories,
} from "@/lib/categories/services/category.service";
import { getSession } from "@/lib/auth/session/dal.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Fetch all product categories
 */
export async function GET(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategories(config);

    if ("error" in response) {
      const error = response;
      return NextResponse.json(error, { status: error.status });
    }

    return NextResponse.json(response, { status: 200 });
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
  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = {
      error: "Unauthorized",
      status: 401,
      message: "You must be logged in",
    };
    logger.error("Unauthorized", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  if (session.data?.user?.role !== "ADMIN") {
    const err = {
      status: 403,
      message: "You do not have permission to perform this action",
    };
    logger.error("Forbidden", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const body = (await request.json()) as CategoryCreate;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await createCategory(config, body);

    if ("error" in response) {
      const error = response as CrudApiError;
      return NextResponse.json(error, { status: error.status });
    }

    logger.info("Category created", { categoryId: response.id });
    return NextResponse.json(response, { status: 201 });
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
