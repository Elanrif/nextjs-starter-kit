import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  fetchProductById,
} from "@/lib/products/services/product.service";
import { ProductUpdate, parseProductUpdate } from "@/lib/products/models/product.model";
import { getLogger } from "@config/logger.config";
import { validationError } from "@/utils/utils.server";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/products/[id]
 */
export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchProductById(config, productId);

    if (!response.ok) {
      const error = response.error!;
      return NextResponse.json({ ok: false, error }, { status: error.status });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * PATCH /api/products/[id]
 */
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  const body = await request.json().catch(() => null);
  const parsed = parseProductUpdate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid product data");
    return NextResponse.json(err, { status: 400 });
  }

  if (Object.keys(parsed.data).length === 0) {
    const err = validationError([], "Request body cannot be empty");
    return NextResponse.json(err, { status: 400 });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateProduct(config, productId, parsed.data as ProductUpdate);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json({ ok: false, error }, { status: error.status });
    }

    logger.info({ productId }, "Product updated");
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "updateProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product update");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * DELETE /api/products/[id]
 */
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await deleteProduct(config, productId);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, { status: error.status });
    }

    logger.info({ productId }, "Product deleted");
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "deleteProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product deletion");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
