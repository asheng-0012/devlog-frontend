import api from "../utils/api";

// Turn a failed request into a simple Error with a readable message
function fail(err) {
    if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
    }
    throw new Error("Can't reach the server. Is the backend running?");
}

// Remove empty values so they are not sent in the URL
function clean(params) {
    const result = {};
    Object.keys(params || {}).forEach((key) => {
        const value = params[key];
        if (value !== "" && value !== "All" && value !== null && value !== undefined) {
            result[key] = value;
        }
    });
    return result;
}

// GET /questions?difficulty=&tag=&source=&search=&page=&limit=
export async function fetchQuestions(params) {
    try {
        const res = await api.get("/questions", { params: clean(params) });
        return res.data;
    } catch (err) {
        fail(err);
    }
}

// GET /questions/:id
export async function fetchQuestion(id) {
    try {
        const res = await api.get(`/questions/${id}`);
        return res.data;
    } catch (err) {
        fail(err);
    }
}

// GET /questions/sources
export async function fetchSources() {
    try {
        const res = await api.get("/questions/sources");
        return res.data;
    } catch (err) {
        fail(err);
    }
}

// GET /questions/tags
export async function fetchTags() {
    try {
        const res = await api.get("/questions/tags");
        return res.data;
    } catch (err) {
        fail(err);
    }
}