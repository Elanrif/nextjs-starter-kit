import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  fetchProducts,
  createProduct,
} from "@lib/product/services/product.service";
import {
  ProductCreate,
  ProductFiltersParams,
} from "@lib/product/models/product.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/products
 * Fetch all products with optional filters
 */
export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);
  const { searchParams } = new URL(request.url);

  // Build filters from query params
  const filters: ProductFiltersParams = {};
  if (searchParams.get("search")) filters.search = searchParams.get("search")!;
  if (searchParams.get("category_id"))
    filters.categoryId = Number(searchParams.get("category_id"));
  if (searchParams.get("is_active"))
    filters.isActive = searchParams.get("is_active") === "true";
  if (searchParams.get("sort_by"))
    filters.sortBy = searchParams.get(
      "sort_by",
    ) as ProductFiltersParams["sortBy"];

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const products = await fetchProducts(config, filters);

    if ("statusCode" in products) {
      const error = products as CrudApiError;
      reqLogger.error("Failed to fetch products", {
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch {
    const status = 500;
    const message = "Could not fetch products";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json({ message }, { status });
  }
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 */
export async function POST(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

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

  const body = (await request.json()) as ProductCreate;

  // Validate required fields
  if (!body?.name || body?.price === undefined) {
    const status = 400;
    const message = "Fields `name` and `price` are required";
    reqLogger.error(`[${session.user.id}] - Bad Request`, { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const product = await createProduct(config, body);

    if ("statusCode" in product) {
      const error = product as CrudApiError;
      reqLogger.error("Failed to create product", {
        status: error.statusCode,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode },
      );
    }

    reqLogger.info("Product created", { productId: product.id });
    return NextResponse.json(product, { status: 201 });
  } catch {
    const status = 500;
    const message = "Could not create product";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json({ message }, { status });
  }
}
