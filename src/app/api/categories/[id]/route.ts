import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { getSession } from "@/lib/auth/jose/jose.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/categories/[id]
 * Fetch a single category by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategory(config, categoryId);

    if (!response.ok) {
      logger.warn("Category not found", {
        categoryId,
        status: response.error.status,
        message: response.error.message,
      });
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategory");
    const status = errMsg.status || 500;
    logger.warn("Error during category fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * PATCH /api/categories/[id]
 * Update a category (requires authentication)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

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

  const body = (await request.json()) as CategoryUpdate;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateCategory(config, categoryId, body);

    if (!response.ok) {
      logger.warn("Failed to update category", {
        categoryId,
        status: response.error.status,
        message: response.error.message,
      });
      return NextResponse.json(response.error, {
        status: response.error.status,
      });
    }

    logger.info("Category updated", { categoryId });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateCategory");
    const status = errMsg.status || 500;
    logger.warn("Error during category update", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * DELETE /api/categories/[id]
 * Delete a category (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteCategory(config, categoryId);

    if (!result.ok) {
      logger.warn("Failed to delete category", {
        categoryId,
        status: result.error.status,
        message: result.error.message,
      });
      return NextResponse.json(result.error, { status: result.error.status });
    }

    logger.info("Category deleted", { categoryId });
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "deleteCategory");
    const status = errMsg.status || 500;
    logger.warn("Error during category deletion", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
