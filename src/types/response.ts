export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  timestamp: string;
}

export const formatSuccess = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

export const formatError = (message: string, code: string): ApiResponse<null> => ({
  success: false,
  error: { message, code },
  timestamp: new Date().toISOString(),
});
