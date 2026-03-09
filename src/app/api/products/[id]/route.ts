import { NextRequest, NextResponse } from "next/server";
import {
  updateProduct,
  deleteProduct,
  fetchProductById,
} from "@/lib/products/services/product.service";
import { ProductUpdate } from "@/lib/products/models/product.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { getSession } from "@/lib/auth/session/dal.service";

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
    const errMsg = crudApiErrorResponse(error, "fetchProduct");
    const status = errMsg.status || 500;
    reqLogger.error("Error during product fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
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

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = {
      error: "Unauthorized",
      status: 401,
      message: "You must be logged in",
    };
    reqLogger.error("Unauthorized", {
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
    reqLogger.error("Forbidden", { status: err.status, message: err.message });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const body = (await request.json()) as ProductUpdate;

  if (Object.keys(body).length === 0) {
    const status = 400;
    const message = "Request body cannot be empty";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await updateProduct(config, productId, body);

    if (!response.ok) {
      const error = response.error;
      reqLogger.error("Failed to update product", {
        productId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json({ ok: false, error }, { status: error.status });
    }

    reqLogger.info("Product updated", { productId });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateProduct");
    const status = errMsg.status || 500;
    reqLogger.error("Error during product update", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
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

  // User authentication and role verification
  const session = await getSession();

  if (!session.ok) {
    const err = {
      error: "Unauthorized",
      status: 401,
      message: "You must be logged in",
    };
    reqLogger.error("Unauthorized", {
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
    reqLogger.error("Forbidden", {
      status: err.status,
      message: err.message,
    });
    return NextResponse.json({ ok: false, error: err }, { status: err.status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await deleteProduct(config, productId);

    if (!response.ok) {
      const error = response.error;
      reqLogger.error("Failed to delete product", {
        productId,
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(response, { status: error.status });
    }

    reqLogger.info("Product deleted", { productId });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "deleteProduct");
    const status = errMsg.status || 500;
    reqLogger.error("Error during product deletion", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
