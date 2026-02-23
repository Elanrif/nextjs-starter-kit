import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchProduct,
  updateProduct,
  deleteProduct,
} from "@lib/product/services/product.service";
import { ProductUpdate } from "@lib/product/models/product.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

/**
 * GET /api/products/[id]
 * Fetch a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    const status = 400;
    const message = "Invalid product ID";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const product = await fetchProduct(config, productId);

    if ("statusCode" in product) {
      const error = product as CrudApiError;
      reqLogger.error("Product not found", {
        productId,
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch {
    const status = 500;
    const message = "Could not fetch product";
    reqLogger.error("Internal Server Error", { status, message, productId });
    return NextResponse.json({ message }, { status });
  }
}

/**
 * PATCH /api/products/[id]
 * Update a product (requires authentication)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params },
) {
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    const status = 400;
    const message = "Invalid product ID";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const body = (await request.json()) as ProductUpdate;

  if (Object.keys(body).length === 0) {
    const status = 400;
    const message = "Request body cannot be empty";
    reqLogger.error(`[${session.user.id}] - Bad Request`, { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const product = await updateProduct(config, productId, body);

    if ("statusCode" in product) {
      const error = product as CrudApiError;
      reqLogger.error("Failed to update product", {
        productId,
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    reqLogger.info("Product updated", { productId, userId: session.user.id });
    return NextResponse.json(product, { status: 200 });
  } catch {
    const status = 500;
    const message = "Could not update product";
    reqLogger.error("Internal Server Error", { status, message, productId });
    return NextResponse.json({ message }, { status });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params },
) {
  const reqLogger = new RequestLogger(logger, request);
  const { id } = await params;
  const productId = Number.parseInt(id, 10);

  if (Number.isNaN(productId)) {
    const status = 400;
    const message = "Invalid product ID";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error("Unauthorized", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const result = await deleteProduct(config, productId);

    if ("statusCode" in result) {
      const error = result as CrudApiError;
      reqLogger.error("Failed to delete product", {
        productId,
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    reqLogger.info("Product deleted", { productId, userId: session.user.id });
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch {
    const status = 500;
    const message = "Could not delete product";
    reqLogger.error("Internal Server Error", { status, message, productId });
    return NextResponse.json({ message }, { status });
  }
}
