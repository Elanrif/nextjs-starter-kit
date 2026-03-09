import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import { getSession } from "@/lib/auth/session/dal.service";

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
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  if (Number.isNaN(categoryId)) {
    const status = 400;
    const message = "Invalid category ID";
    reqLogger.warn("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = session.error;
    reqLogger.error("Unauthorized", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json(
      { ok: false, error: err },
      { status: err.status || 500 },
    );
  }

  if (session.data?.user?.role !== "ADMIN") {
    const err = {
      status: 403,
      message: "You do not have permission to perform this action",
    };
    reqLogger.error("Forbidden", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategory(config, categoryId);

    if ("error" in response) {
      const error = response;
      reqLogger.warn("Category not found", {
        categoryId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(response, { status: 200 });
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
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  if (Number.isNaN(categoryId)) {
    const status = 400;
    const message = "Invalid category ID";
    reqLogger.warn("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = session.error;
    reqLogger.error("Unauthorized", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json(
      { ok: false, error: err },
      { status: err.status || 500 },
    );
  }

  if (session.data?.user?.role !== "ADMIN") {
    const err = {
      status: 403,
      message: "You do not have permission to perform this action",
    };
    reqLogger.error("Forbidden", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const body = (await request.json()) as CategoryUpdate;

  if (Object.keys(body).length === 0) {
    const status = 400;
    const message = "Request body cannot be empty";
    reqLogger.warn("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateCategory(config, categoryId, body);
    if ("error" in response) {
      const error = response;
      reqLogger.warn("Failed to update category", {
        categoryId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    reqLogger.info("Category updated", {
      categoryId,
    });
    return NextResponse.json(response, { status: 200 });
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
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);

  if (Number.isNaN(categoryId)) {
    const status = 400;
    const message = "Invalid category ID";
    reqLogger.warn("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = session.error;
    return NextResponse.json({ ok: false, error: err }, { status: 401 });
  }

  if (session.data?.user?.role !== "ADMIN") {
    const err = {
      status: 403,
      message: "You do not have permission to perform this action",
    };
    reqLogger.error("Forbidden", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteCategory(config, categoryId);

    if ("error" in result) {
      const error = result as CrudApiError;
      reqLogger.warn("Failed to delete category", {
        categoryId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    reqLogger.info("Category deleted", {
      categoryId,
    });
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 },
    );
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
