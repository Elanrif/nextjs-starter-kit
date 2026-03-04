import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

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

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const category = await fetchCategory(config, categoryId);

    if ("status" in category) {
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
  } catch {
    const status = 500;
    const message = "Could not fetch category";
    reqLogger.error("Internal Server Error", { status, message, categoryId });
    return NextResponse.json({ message }, { status });
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

  // // Check authentication
  // const session = await getServerSession(request);

  // if (!session?.user) {
  //   const status = 401;
  //   const message = "You must be logged in";
  //   reqLogger.error("Unauthorized", { status, message });
  //   return NextResponse.json({ message }, { status });
  // }

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

    if ("status" in category) {
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
  } catch {
    const status = 500;
    const message = "Could not update category";
    reqLogger.error("Internal Server Error", { status, message, categoryId });
    return NextResponse.json({ message }, { status });
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

  // // Check authentication
  // const session = await getServerSession(request);

  // if (!session?.user) {
  //   const status = 401;
  //   const message = "You must be logged in";
  //   reqLogger.error("Unauthorized", { status, message });
  //   return NextResponse.json({ message }, { status });
  // }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteCategory(config, categoryId);

    if ("status" in result) {
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
  } catch {
    const status = 500;
    const message = "Could not delete category";
    reqLogger.error("Internal Server Error", { status, message, categoryId });
    return NextResponse.json({ message }, { status });
  }
}
