const appConfig = {
    scrappingInfo: {
        youTube: {
            baseUrl : {
                URL: "https://www.youtube.com",
            },
            trending: {
                URL: "/feed/trending",
                data: {
                    id: null,
                    video: {
                        title: {
                            text: null,
                            label : null,
                        },
                        description: null,
                        url: null,
                        thumbnails: [],
                        views: {
                            viewCountText: null,
                            shortViewCountText : null,
                        },
                        likes: {
                            viewCountText: null,
                            shortViewCountText : null,
                        },
                        dislikes: {
                            viewCountText: null,
                            shortViewCountText : null,
                        },
                    },
                    channel: {
                        title: {
                            text: null,
                        },
                        description: null,
                        thumbnails: [],
                        subscribers: {
                            viewCountText: null,
                            shortViewCountText : null,
                        },
                    }
                }

            }
        }
    },
    responseType: {
        success: {
            status: "success",
            message: "",
            data: []
        },
        error: {
            status: "failed",
            message: "",
            data: []
        }
    },
    mongo : {
        url : "mongodb://localhost:27017/",
        db : "ytDocuments"
    }
    

}

module.exports = appConfig;
