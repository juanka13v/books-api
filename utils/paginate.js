function paginate(model) {
    return async function (req, res, next) {
        const currentPage = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 10;

        const skip = (currentPage - 1) * pageSize;
        const limit = pageSize;


        const totalCountPromise = model.countDocuments().exec();
        const docsPromise = model.find().skip(skip).limit(limit).exec();
        const [totalCount, docs] = await Promise.all([totalCountPromise, docsPromise]);

        const totalPages = Math.ceil(totalCount / pageSize);

        res.paginatedResults = {
            totalCount,
            totalPages,
            currentPage,
            pageSize,
            results: docs
        };
        next();
    }
}
module.exports = paginate;