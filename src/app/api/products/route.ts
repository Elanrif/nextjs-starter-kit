import { NextRequest, NextResponse } from "next/server";
import { fetchProducts, createProduct } from "@/lib/products/services/product.service";
import {
  ProductCreate,
  ProductFiltersParams,
  parseProductCreate,
} from "@/lib/products/models/product.model";
import { getLogger } from "@config/logger.config";
import { validationError } from "@/utils/utils.server";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Fetch all products with optional filters
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Build filters from query params
  const filters: ProductFiltersParams = {};
  if (searchParams.get("search")) filters.search = searchParams.get("search")!;
  if (searchParams.get("categoryId")) filters.categoryId = Number(searchParams.get("categoryId"));
  if (searchParams.get("isActive")) filters.isActive = searchParams.get("isActive") === "true";
  if (searchParams.get("sortBy"))
    filters.sortBy = searchParams.get("sortBy") as ProductFiltersParams["sortBy"];

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    //const products = await fetchProducts(config, filters);
    const response = await fetchProducts(config, filters);

    if (!response.ok) {
      const error = response.error!;
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "fetchProducts");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product fetching");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = parseProductCreate(body);
  if (!parsed.success) {
    const err = validationError(parsed.error.issues, "Invalid product data");
    return NextResponse.json(err, {
      status: 400,
    });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await createProduct(config, parsed.data as ProductCreate);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, {
        status: error.status,
      });
    }

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "createProduct");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during product creation");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
