import revalidateAction from "./actions";

export async function GET() {
    revalidateAction();
    return Response.json({
        "success": true,
        "statusCode": 200,
        "message": "Success",
    })
}