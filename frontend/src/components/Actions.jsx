import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useCustomToast from "../hooks/useCustomToast";
import { Stack, Button, Text } from "@chakra-ui/react";
import Icon from "./Icon";


export const ActionButton = (props) => {
  return (
    <Button
      w={0}
      h={8}
      borderRadius={"full"}
      bg="glass.bg.light"
      onClick={props.onClick}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        bg: "accent.glassHover",
        transform: "scale(1.1)",
      }}
      _active={{
        transform: "scale(0.95)",
      }}
    >
      <Icon name={props.icon} fill={props.fill} />
      {props.count !== undefined ? (
        <Text ml={1.5} fontSize={11} fontWeight="600">
          {props.count}
        </Text>
      ) : null}
    </Button>
  );
};

const Actions = (props) => {
  const showToast = useCustomToast();
  const user = useRecoilValue(userAtom);

  const [liked, setLiked] = useState(props.post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(props.post.likes.length);
  const [setReposted] = useState(props.post.repostedBy.includes(user?._id));
  const [repostsCount, setRepostsCount] = useState(props.post.repostedBy.length);
  const [saved, setSaved] = useState(props.post.savedBy.includes(user?._id));
  const [savedCount, setSavedCount] = useState(props.post.savedBy.length);
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const postLike = async () => {
    if (!user) {
      return showToast("You must be logged in to like a post", "error");
    }
    if (isLiking) return;

    setIsLiking(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      const res = await fetch(`/api/posts/like/${props.post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status === 200) {
        showToast(data.message, "success");
      } else {
        setLiked(wasLiked);
        setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
        showToast(data.message, "error");
      }
    } catch (err) {
      setLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
      showToast(err.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const postRepost = async () => {
    if (!user) {
      return showToast("You must be logged in to repost", "error");
    }
    const userConfirmed = window.confirm("Do you want to repost this post?");

    if (userConfirmed) {
      if (isReposting) return;
      setIsReposting(true);
      showToast("Reposting...", "info");

      setReposted(true);
      setRepostsCount(prev => prev + 1);

      try {
        const res = await fetch(`/api/posts/${props.post._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data.status === 200) {
          showToast(data.message, "success");
        } else {
          setReposted(false);
          setRepostsCount(prev => prev - 1);
          showToast(data.message, "error");
        }
      } catch (err) {
        setReposted(false);
        setRepostsCount(prev => prev - 1);
        showToast(err.message, "error");
      } finally {
        setIsReposting(false);
      }
    } else {
      showToast("Reposting cancelled!", "info");
    }
  };

  const copyToClipboard = () => {
    const link = `localhost:3000/${props.post.postedBy.username}/post/${props.post._id}`;
    navigator.clipboard.writeText(link);
    showToast("Post link copied to clipboard!", "success");
  };

  const postDelete = async () => {
    showToast("Deleting...", "info");
    const res = await fetch(`/api/posts/${props.post._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.status === 200) {
      window.location.reload();
      return showToast(data.message, "success");
    } else {
      return showToast(data.message, "error");
    }
  };

  const postSave = async () => {
    if (!user) {
      return showToast("You must be logged in to save a post", "error");
    }
    if (isSaving) return;
    setIsSaving(true);

    const wasSaved = saved;
    setSaved(!wasSaved);
    setSavedCount(prev => wasSaved ? prev - 1 : prev + 1);

    showToast(wasSaved ? "Unsaving..." : "Saving...", "info");

    try {
      const res = await fetch(`/api/posts/save/${props.post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.status === 200) {
        showToast(data.message, "success");
      } else {
        setSaved(wasSaved);
        setSavedCount(prev => wasSaved ? prev + 1 : prev - 1);
        showToast(data.message, "error");
      }
    } catch (err) {
      setSaved(wasSaved);
      setSavedCount(prev => wasSaved ? prev + 1 : prev - 1);
      showToast(err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack direction={"row"}>
      <ActionButton
        icon={"heart"}
        fill={liked ? "rgb(255, 0, 0)" : "transparent"}
        count={likesCount}
        onClick={postLike}
      />
      <ActionButton
        icon={"comment"}
        count={props.post.replies.length}
        onClick
      />
      <ActionButton
        icon={"plus"}
        count={repostsCount}
        onClick={postRepost}
      />
      <ActionButton
        icon={"bookmark"}
        fill={saved ? "rgb(0, 0, 0)" : "transparent"}
        count={savedCount}
        onClick={postSave}
      />
      <ActionButton icon={"share"} onClick={copyToClipboard} />
      {user?._id === props.post.postedBy._id ? (
        <ActionButton icon={"trash"} onClick={postDelete} />
      ) : null}
    </Stack>
  );
};

export default Actions;
