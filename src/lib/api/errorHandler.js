export class ApiError extends Error {
  constructor(message, status = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const handleApiError = (error, defaultStatus = 500) => {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return new Response(
      JSON.stringify({
        error: error.message,
        code: error.code,
        status: error.status
      }),
      { status: error.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    let message = 'Database error';
    let status = 400;

    if (error.code === 'P2002') {
      message = 'This record already exists';
      status = 409;
    } else if (error.code === 'P2025') {
      message = 'Record not found';
      status = 404;
    }

    return new Response(
      JSON.stringify({ error: message, code: error.code }),
      { status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }),
    { status: defaultStatus, headers: { 'Content-Type': 'application/json' } }
  );
};

export const validateRequest = (req, requiredFields = []) => {
  const errors = [];

  for (const field of requiredFields) {
    if (!req[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    throw new ApiError(errors.join(', '), 400, 'VALIDATION_ERROR');
  }
};
