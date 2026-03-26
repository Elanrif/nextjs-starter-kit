import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { isApiError } from "@/shared/errors/api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/categories/[id]
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchCategory(config, categoryId);

    if (isApiError(response)) {
      return NextResponse.json(response, { status: response.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during category fetching");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * PATCH /api/categories/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);
  const body = (await request.json()) as CategoryUpdate;
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateCategory(config, categoryId, body);

    if (isApiError(response)) {
      return NextResponse.json(response, { status: response.status });
    }

    logger.info({ categoryId }, "Category updated");
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "updateCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during category update");
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * DELETE /api/categories/[id]
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const categoryId = Number.parseInt(id, 10);
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteCategory(config, categoryId);

    if (isApiError(result)) {
      return NextResponse.json(result, { status: result.status });
    }

    logger.info({ categoryId }, "Category deleted");
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "deleteCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during category deletion");
    return NextResponse.json(errMsg, { status });
  }
}
