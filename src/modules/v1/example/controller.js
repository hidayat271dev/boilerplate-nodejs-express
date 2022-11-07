const response = require("../../../common/response");
const CONTROLLER_NAME = 'ADMIN_FINOPS_CONTROLLER';

exports.getExample = async (req, res) => {
    res.json(
        response.success(
            "Success for example",
            null,
            200,
            "SUCCESS",
            null,
        )
    )
}

exports.postExample = async (req, res) => {
    res.json(
        response.success(
            "Success for example",
            null,
            200,
            "SUCCESS",
            null,
        )
    )
}

exports.putExample = async (req, res) => {
    res.json(
        response.success(
            "Success for example",
            null,
            200,
            "SUCCESS",
            null,
        )
    )
}

exports.deleteExample = async (req, res) => {
    res.json(
        response.success(
            "Success for example",
            null,
            200,
            "SUCCESS",
            null,
        )
    )
}
