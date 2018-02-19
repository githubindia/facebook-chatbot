module.exports = {
    "dbErrorResponse": function () {
        var response = {
            "error":"Internal server error",
            "error_status":true,
            "status_code":503,
            "error_message":"DB error, connection lost."
        }
        return response;
    }
}