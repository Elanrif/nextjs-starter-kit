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
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return new Response(null, { status: status });
  }

  // Check if the user has the 'admin' role
  if (session?.user?.role !== "ADMIN") {
    // User is authenticated but does not have the right permissions
    const status = 403;
    const message = "You do not have permission to perform this action";
    reqLogger.error("Forbidden", { status, message });
    return new Response(null, { status: status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const category = await fetchCategory(config, categoryId);

    if ("error" in category) {
      const error = category as CrudApiError;
      reqLogger.error("Category not found", {
        categoryId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategory");
    const status = errMsg.status || 500;
    logger.error("Error during category fetching", {
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
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return new Response(null, { status: status });
  }

  // Check if the user has the 'admin' role
  if (session?.user?.role !== "ADMIN") {
    // User is authenticated but does not have the right permissions
    const status = 403;
    const message = "You do not have permission to perform this action";
    reqLogger.error("Forbidden", { status, message });
    return new Response(null, { status: status });
  }

  const body = (await request.json()) as CategoryUpdate;

  if (Object.keys(body).length === 0) {
    const status = 400;
    const message = "Request body cannot be empty";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const category = await updateCategory(config, categoryId, body);
    if ("error" in category) {
      const error = category as CrudApiError;
      reqLogger.error("Failed to update category", {
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
    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateCategory");
    const status = errMsg.status || 500;
    logger.error("Error during category update", {
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
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // User authentication and role verification
  const session = await getSession();

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return new Response(null, { status: status });
  }

  // Check if the user has the 'admin' role
  if (session?.user?.role !== "ADMIN") {
    // User is authenticated but does not have the right permissions
    const status = 403;
    const message = "You do not have permission to perform this action";
    reqLogger.error("Forbidden", { status, message });
    return new Response(null, { status: status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteCategory(config, categoryId);

    if ("error" in result) {
      const error = result as CrudApiError;
      reqLogger.error("Failed to delete category", {
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
    logger.error("Error during category deletion", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
