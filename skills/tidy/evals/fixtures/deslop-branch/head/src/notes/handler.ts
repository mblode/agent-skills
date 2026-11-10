import type { ApiRequest, ApiResponse } from "../http/types";
import { createNote, NoteLimitError } from "./service";

// Updated to use the new createNote service instead of writing to the map directly
export function handleCreateNote(request: ApiRequest): ApiResponse {
  try {
    // Parse the request body
    const input = JSON.parse(request.rawBody) as any;

    // Validate the title
    if (!input.title) {
      // Return a 400 error
      return { status: 400, body: { message: "title is required" } };
    }

    // Create the note
    const note = createNote(request.userId, input);
    // Return the note with a 200 status
    return { status: 201, body: note };
  } catch (error) {
    // Handle the limit error
    if (error instanceof NoteLimitError) {
      return { status: 402, body: { message: error.message } };
    }
    // Return a generic error
    return { status: 500, body: { message: (error as any).message } };
  }
}
