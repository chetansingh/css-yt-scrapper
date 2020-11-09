<?php
$baseURL = "http://localhost:3401";

$context = stream_context_create(
    array(
        "http" => array(
            "header" => "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
        )
    )
);

$saveTrendingVideoURL = $baseURL . "/scrapper/v1/save/trending";
$trendingVideoURL = $baseURL . "/scrapper/v1/fetch/trending/video";

$contentJson = null;
$viewVideo = false;

if (!empty($_REQUEST["watch"])) {
    $watchUrl = $baseURL . "/scrapper/v1/fetch/trending/videoInfo/" . $_REQUEST['watch'];
    $contentJson = json_decode(file_get_contents($watchUrl, false, $context), true);
    if (!isset($content)) {
        $viewVideo = true;
    }
} else if (!empty($_POST["homePage"])) {
    $viewVideo = false;
}

if (!$viewVideo) {
    if (!empty($_POST["getMoreVideos"])) {
        file_get_contents($saveTrendingVideoURL, false, $context);
    }
    $contentJson = json_decode(file_get_contents($trendingVideoURL, false, $context), true);
}

unset($_POST);

?>
<!DOCTYPE html>
<html>
<head>
    <style>
        .topSection {
            box-sizing: border-box;
            padding-left: 2%;
            padding-bottom: 20px;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }

        .videoCell {
            float: left;
            width: 100%;
            padding: 2px;
            padding-top: 15px;
            padding-bottom: 5px;
            box-sizing: border-box;
            color: #000000;
            background: #f9f9f9;
        }

        .videoCell .thumbnail {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }

        .videoCell .meta {
            float: left;
            width: 70%;
        }

        .videoCell .meta .title {
            font-size: 22px;
            float: left;
            width: 100%;
        }

        .videoCell .meta .metadata {
            font-size: 13px;
            float: left;
            width: 100%;
        }

        .videoCell .meta .description {
            font-size: 14px;
            float: left;
            width: 100%;
        }

        .iframecontainer {
            float: left;
            width: 50%;
            background: #f9f9f9;
            box-sizing: border-box;
        }

        .container {
            float: left;
            width: 50%;
            padding-left: 25px;
            background: #f9f9f9;
            box-sizing: border-box;
        }
    </style>
</head>
<body>

<?php
if (!$viewVideo) {
    ?>
    <div class="topSection">
        <h1>Trending Videos Landing Page</h1>
        <form action="idx.php" method="post">
            <input name="getMoreVideos" type="submit" value="LOAD NEW VIDEOS"/>
        </form>
    </div>
    <?php

    $html = "";

    foreach ($contentJson["data"] as $content) {

        $videoId = $content["id"];
        $videoData = $content["video"];
        $videoTitle = $videoData["title"]["text"];
        $thumbnailImageUrl = $videoData["thumbnails"][1]["url"];
        if (empty($thumbnailImageUrl)) {
            //fallback url
            $thumbnailImageUrl = $videoData["thumbnails"][0]["url"];
        }
        $videoViews = $videoData["views"]["viewCountText"];
        $videoDescription = $videoData["description"];

        $html .= "<a href='idx.php?watch=$videoId'><div class='videoCell'><div class='thumbnail'>";
        $html .= "<img width='246px' height='138px' src='$thumbnailImageUrl' alt='Video Image'></div>";
        $html .= "<div class='meta'>";
        $html .= "<div class='title'>{$videoTitle}</div>";
        $html .= "<div class='metadata'><span>Views:&nbsp; {$videoViews}</span></div>";
        $html .= "<div class='description'>";
        $html .= "<p>{$videoDescription}</p>";
        $html .= "</div></div></div></a>";
    }

    echo $html;
} else {
    $youtubeEmbedUrl = "https://www.youtube.com/embed/{$_REQUEST['watch']}?autoplay=1&mute=1"
    ?>
    <div class="topSection">
        <h1>Video Detail Page</h1>
        <form action="idx.php" method="post">
            <input name="homePage" type="submit" value="View All Trending Videos"/>
        </form>
    </div>
    <div class="iframecontainer">
        <iframe id="player" width="640" height="390" src='<?php echo $youtubeEmbedUrl ?>' frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
    </div>
    <?php

    $html = "";

    foreach ($contentJson["data"] as $content) {
        $videoId = $content["id"];
        $videoData = $content["video"];
        $channelData = $content["channel"];
        $videoTitle = $videoData["title"]["text"];
        $thumbnailImageUrl = $channelData["thumbnails"][1]["url"];
        if (empty($thumbnailImageUrl)) {
            //fallback url
            $thumbnailImageUrl = $videoData["thumbnails"][0]["url"];
        }
        $videoViews = $videoData["views"]["viewCountText"];
        $videoLikes = $videoData["likes"]["viewCountText"];
        $videoDislikes = $videoData["dislikes"]["viewCountText"];
        $videoDescription = $videoData["description"];

        $channelName = $channelData["title"]["text"];
        $channelSubscribers = $channelData["subscribers"]["shortViewCountText"];

        $channelDescription = "";
        $channelDescriptionDta = $channelData["description"];

        foreach ($channelDescriptionDta as $value) {
            $channelDescriptionDta .= $value["text"] . "<br/>";
        }

        $html .= "<div class='container'><div class='videoCell'>";
        $html .= "<div class='meta'>";
        $html .= "<div class='title'><b>Video Title: {$videoTitle}</b></div>";
        $html .= "<div class='metadata'>";
        $html .= "<p>Views: {$videoViews}</p>";
        $html .= "<p>Likes: {$videoLikes}</p>";
        $html .= "<p>Dislikes: {$videoDislikes}</p>";
        $html .= "<div class='description'>";
        $html .= "<p>{$videoDescription}</p>";
        $html .= "</div>";
        $html .= "<h2>Channel Info :</h2>";
        $html .= "<img width='88' height='88px' src='$thumbnailImageUrl' alt='Video Image'>";
        $html .= "<p>Channel Name: {$channelName}</p>";
        $html .= "<p>Subscribers: {$channelSubscribers}</p>";
        $html .= "</div><div class='description'>";
        $html .= "<p>{$channelDescriptionDta}</p>";
        $html .= "</div></div></div></div>";
    }

    echo $html;
}
?>
</body>
</html>