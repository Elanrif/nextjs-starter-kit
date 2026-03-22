import { NextRequest, NextResponse } from "next/server";
import {
  fetchCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categories/services/category.service";
import { CategoryUpdate } from "@/lib/categories/models/category.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";

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

    if (!response.ok) {
      return NextResponse.json(response.error, { status: response.error.status });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category fetching");
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

    if (!response.ok) {
      return NextResponse.json(response.error, { status: response.error.status });
    }

    logger.info({ categoryId }, "Category updated");
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category update");
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

    if (!result.ok) {
      return NextResponse.json(result.error, { status: result.error.status });
    }

    logger.info({ categoryId }, "Category deleted");
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "deleteCategory");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.message }, "Error during category deletion");
    return NextResponse.json(errMsg, { status });
  }
}
