import { NextRequest, NextResponse } from "next/server";
import {
  fetchProducts,
  createProduct,
} from "@/lib/products/services/product.service";
import {
  ProductCreate,
  ProductFiltersParams,
} from "@/lib/products/models/product.model";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import { verifySession } from "@/lib/auth/session/dal.service";

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
  if (searchParams.get("categoryId"))
    filters.categoryId = Number(searchParams.get("categoryId"));
  if (searchParams.get("isActive"))
    filters.isActive = searchParams.get("isActive") === "true";
  if (searchParams.get("sortBy"))
    filters.sortBy = searchParams.get(
      "sortBy",
    ) as ProductFiltersParams["sortBy"];

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    //const products = await fetchProducts(config, filters);
    const products = await fetchProducts(config, filters);

    if ("error" in products) {
      const error = products as CrudApiError;
      reqLogger.error("Failed to fetch products", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchProducts");
    const status = errMsg.status || 500;
    logger.error("Error during product fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 */
export async function POST(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

  // User authentication and role verification
  const session = await verifySession();

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

  const body = (await request.json()) as ProductCreate;

  // Validate required fields
  if (!body?.name || body?.price === undefined) {
    const status = 400;
    const message = "Fields `name` and `price` are required";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const product = await createProduct(config, body);

    if ("error" in product) {
      const error = product as CrudApiError;
      reqLogger.error("Failed to create product", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    reqLogger.info("Product created", { productId: product.id });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createProduct");
    const status = errMsg.status || 500;
    logger.error("Error during product creation", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
