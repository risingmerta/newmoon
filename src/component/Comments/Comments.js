"use client";
import React, { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import { BsSendFill } from "react-icons/bs";
import { TbCaretUpDownFilled } from "react-icons/tb";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { db } from "../../../firebase"; // Import Firestore instance
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import "./comments.css";
import { SiTicktick } from "react-icons/si";
import {
  FaAngleDown,
  FaCaretDown,
  FaCaretLeft,
  FaCaretUp,
  FaRegCommentAlt,
  FaReply,
} from "react-icons/fa";
import { LinkedinIcon } from "react-share";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SignInSignUpModal from "../SignSignup/SignInSignUpModal";

const Comments = (props) => {
  const { data: session } = useSession();
  const [logIsOpen, setLogIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // For replying to comment or reply
  const [likeTo, setLikeTo] = useState(null); // For replying to comment or reply
  const [dislikeTo, setDislikeTo] = useState(null); // For replying to comment or reply
  const [reply, setReply] = useState(""); // For replies
  const [comments, setComments] = useState([]); // Store comments from Firestore
  const [selectOne, setSelectOne] = useState(`Episode ${props.epiod}`);
  const [allEpisodesCount, setAllEpisodesCount] = useState(0);
  const [allComments, setAllComments] = useState([]); // Store comments from Firestore
  const [currentEpisodeCount, setCurrentEpisodeCount] = useState(0);
  const [selectTwo, setSelectTwo] = useState("Newest");
  const [replyCount, setReplyCount] = useState(0);
  const [repliesData, setRepliesData] = useState("");
  const [commentsData, setCommentsData] = useState("");

  const anId = props.anId; // Anime ID
  const epId = props.epId; // Episode ID
  const email = session?.user?.email || "";
  const userName = session?.user?.username || ""; // Default userName
  const imageUrl =
    session?.user?.randomImage || "https://hianime.to/images/no-avatar.jpeg"; // Default profile image

  // Fetch comments and replies from Firestore
  const fetchComments = async (anId, epId) => {
    try {
      const allCommentsCollection = collection(
        db,
        "animeComments",
        anId,
        "comments"
      );
      let allCommentsQuery;

      if (selectTwo === "Top") {
        allCommentsQuery = query(
          allCommentsCollection,
          orderBy("userLikesCount", "desc") // Order by the length of 'userLikes'
        );
      } else {
        let orderDirection = selectTwo === "Oldest" ? "asc" : "desc"; // Set order based on selectTwo
        allCommentsQuery = query(
          allCommentsCollection,
          orderBy("createdAt", orderDirection) // Order by 'createdAt' for 'Newest' or 'Oldest'
        );
      }

      const allCommentsSnapshot = await getDocs(allCommentsQuery);

      console.log("All comments snapshot:", allCommentsSnapshot.docs); // Debugging log

      const fetchedAllComments = allCommentsSnapshot.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
        replies: [],
      }));

      console.log("Fetched All Comments:", fetchedAllComments); // Debugging log

      let allTotalRepliesCount = 0;
      for (let comment of fetchedAllComments) {
        const repliesCollection = collection(
          db,
          "animeComments",
          anId,
          "comments",
          comment.commentId,
          "replies"
        );
        let repliesQuery;

        if (selectTwo === "Top") {
          repliesQuery = query(
            repliesCollection,
            orderBy("userLikesCount", "desc") // Order by the length of 'userLikes'
          );
        } else {
          let orderDirection = selectTwo === "Oldest" ? "asc" : "desc"; // Set order based on selectTwo
          repliesQuery = query(
            repliesCollection,
            orderBy("createdAt", orderDirection) // Order by 'createdAt' for 'Newest' or 'Oldest'
          );
        }

        const repliesSnapshot = await getDocs(repliesQuery);
        console.log("Replies snapshot:", repliesSnapshot.docs); // Debugging log

        const replies = repliesSnapshot.docs.map((doc) => ({
          replyId: doc.id,
          ...doc.data(),
        }));

        comment.replies = replies;
        allTotalRepliesCount += replies.length;
      }

      const allTotalCommentsCount = fetchedAllComments.length;
      const allTotalCommentsAndReplies =
        allTotalCommentsCount + allTotalRepliesCount;

      // Optionally, set the comments and counts if needed
      setAllComments(fetchedAllComments);
      setAllEpisodesCount(allTotalCommentsAndReplies);

      // Debugging logs for the second part
      console.log("Fetching episode-specific comments...");

      const commentsCollection = collection(
        db,
        "anime",
        anId,
        "episodes",
        epId,
        "comments"
      );
      let commentsQuery;

      if (selectTwo === "Top") {
        commentsQuery = query(
          commentsCollection,
          orderBy("userLikesCount", "desc") // Order by the length of 'userLikes'
        );
      } else {
        let orderDirection = selectTwo === "Oldest" ? "asc" : "desc"; // Set order based on selectTwo
        commentsQuery = query(
          commentsCollection,
          orderBy("createdAt", orderDirection) // Order by 'createdAt' for 'Newest' or 'Oldest'
        );
      }

      const commentsSnapshot = await getDocs(commentsQuery);

      console.log("Episode comments snapshot:", commentsSnapshot.docs); // Debugging log

      const fetchedComments = commentsSnapshot.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
        replies: [],
      }));

      console.log("Fetched Comments:", fetchedComments); // Debugging log

      let totalRepliesCount = 0;
      for (let comment of fetchedComments) {
        const repliesCollection = collection(
          db,
          "anime",
          anId,
          "episodes",
          epId,
          "comments",
          comment.commentId,
          "replies"
        );
        let repliesQuery;
        try {
          if (selectTwo === "Top") {
            repliesQuery = query(
              repliesCollection,
              orderBy("userLikesCount", "desc") // Order by the length of 'userLikes'
            );
          } else {
            let orderDirection = selectTwo === "Oldest" ? "asc" : "desc"; // Set order based on selectTwo
            repliesQuery = query(
              repliesCollection,
              orderBy("createdAt", orderDirection) // Order by 'createdAt' for 'Newest' or 'Oldest'
            );
          }
        } catch (error) {
          alert(`${error}`);
        }

        const repliesSnapshot = await getDocs(repliesQuery);

        console.log("Episode Replies snapshot:", repliesSnapshot.docs); // Debugging log

        const replies = repliesSnapshot.docs.map((doc) => ({
          replyId: doc.id,
          ...doc.data(),
        }));

        comment.replies = replies;
        totalRepliesCount += replies.length;
      }

      const totalCommentsCount = fetchedComments.length;
      const totalCommentsAndReplies = totalCommentsCount + totalRepliesCount;
      setReplyCount(totalRepliesCount);

      // Optionally, set the comments and counts if needed
      setComments(fetchedComments);
      setCurrentEpisodeCount(totalCommentsAndReplies);
    } catch (error) {
      console.error("Error fetching comments:", error);
      alert(`${error}`);
    }
  };

  useEffect(() => {
    if (anId && epId) {
      fetchComments(anId, epId); // Fetch comments when the component mounts
    }
  }, [anId, epId, selectTwo, likeTo, dislikeTo]);

  // Add a comment
  const addComment = async (
    anId,
    epId,
    commentText,
    email,
    userName,
    epiod,
    imageUrl
  ) => {
    const commentId = `${Date.now()}_${userName}`; // Generate unique commentId
    const commentData = {
      text: commentText,
      createdAt: serverTimestamp(),
      email: email,
      userName: userName,
      imageUrl: imageUrl, // Include imageUrl
      userLikes: [],
      userLikesCount: 0,
      userDislikes: [],
      userDislikesCount: 0,
      episodeNo: epiod,
    };

    try {
      // Store comment under the anime's episode
      await setDoc(
        doc(db, "anime", anId, "episodes", epId, "comments", commentId),
        commentData
      );

      // Also add to userComments collection
      await setDoc(doc(db, "userComments", email, "comments", commentId), {
        anId,
        epId,
        ...commentData,
      });

      await setDoc(doc(db, "animeComments", anId, "comments", commentId), {
        anId,
        epId,
        ...commentData,
      });

      console.log("Comment added successfully with ID:", commentId);

      // Refetch comments after adding a new comment
      fetchComments(anId, epId);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Add a reply or a nested reply
  const addReply = async (
    anId,
    epId,
    parentId,
    replyText,
    email,
    userName,
    epiod,
    imageUrl,
    replyOnReplyId = null
  ) => {
    const replyId = `${Date.now()}_${userName}`; // Generate unique replyId
    const replyData = {
      text: replyText,
      createdAt: serverTimestamp(),
      email: email,
      userName: userName,
      imageUrl: imageUrl, // Include imageUrl for replies
      anId: anId,
      epId: epId,
      parentId: {
        commentId: parentId.commentId,
      },
      replyOnReplyId: replyOnReplyId ? `${replyOnReplyId}_${userName}` : null, // Include userName in replyOnReplyId
      commentId: replyId,
      userLikes: [],
      userLikesCount: 0,
      userDislikes: [],
      userDislikesCount: 0,
      episodeNo: epiod,
    };

    try {
      // Store reply under the parent comment's replies collection
      await setDoc(
        doc(
          db,
          "anime",
          anId,
          "episodes",
          epId,
          "comments",
          parentId.commentId,
          "replies",
          replyId
        ),
        replyData
      );

      // Add reply to userComments collection (optional)
      await setDoc(doc(db, "userComments", email, "replies", replyId), {
        anId,
        epId,
        parentId,
        ...replyData,
      });

      await setDoc(
        doc(
          db,
          "animeComments",
          anId,
          "comments",
          parentId.commentId,
          "replies",
          replyId
        ),
        {
          ...replyData,
        }
      );

      console.log("Reply added successfully with ID:", replyId);

      // Refetch comments after adding a new reply
      fetchComments(anId, epId);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const manageLike = async (
    anId,
    epId,
    parentId,
    email,
    userName,
    imageUrl
  ) => {
    const user = userName;
    try {
      // Reference to the specific document in anime collection
      const docRefAnime = doc(
        db,
        "anime",
        anId,
        "episodes",
        epId,
        "comments",
        parentId.commentId
      );

      // Reference to the specific document in animeComments collection
      const docRefAnimeComments = doc(
        db,
        "animeComments",
        anId,
        "comments",
        parentId.commentId
      );

      // Reference to the specific document in userComments collection
      const docRefUserComments = doc(
        db,
        "userComments",
        email,
        "comments",
        parentId.commentId
      );

      // Function to handle the like/dislike update logic
      const handleUpdate = async (docRef, collectionName) => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userLikeArray = docSnap.data().userLikes || []; // Make sure field name matches
          const userDislikeArray = docSnap.data().userDislikes || []; // Make sure field name matches
          const userDislikeCounts = docSnap.data().userDislikesCount || 0; // Make sure field name matches
          const userLikeCounts = docSnap.data().userLikesCount || 0; // Make sure field name matches

          console.log(`${collectionName} - Current userLikes: `, userLikeArray);
          console.log(
            `${collectionName} - Current userDislikes: `,
            userDislikeArray
          );

          if (userDislikeArray.includes(user)) {
            // User is in userDislike, remove from userDislike and add to userLike
            await updateDoc(docRef, {
              userDislikes: arrayRemove(user),
              userLikes: arrayUnion(user),
              userLikesCount: userLikeCounts + 1,
              userDislikesCount: userDislikeCounts - 1,
            });
            console.log(
              `${user} removed from userDislikes and added to userLikes in ${collectionName}`
            );
          } else if (userLikeArray.includes(user)) {
            // User is in userLike, remove from userLike
            await updateDoc(docRef, {
              userLikes: arrayRemove(user),
              userLikesCount: userLikeCounts - 1,
            });
            console.log(`${user} removed from userLikes in ${collectionName}`);
          } else {
            // User is in neither array, add them to userLike
            await updateDoc(docRef, {
              userLikes: arrayUnion(user),
              userLikesCount: userLikeCounts + 1,
            });
            console.log(`${user} added to userLikes in ${collectionName}`);
          }
        } else {
          console.log(`No such document in ${collectionName}`);
        }
      };

      // Update each collection
      await handleUpdate(docRefAnime, "anime");
      await handleUpdate(docRefAnimeComments, "animeComments");
      await handleUpdate(docRefUserComments, "userComments");

      const docSnap = await getDoc(docRefAnimeComments);
      setCommentsData(docSnap.data());

      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const manageReplyLike = async (
    anId,
    epId,
    parentId,
    parentIdd,
    email,
    userName,
    imageUrl
  ) => {
    const user = userName;
    try {
      // Reference to the specific document in anime collection
      const docRefAnime = doc(
        db,
        "anime",
        anId,
        "episodes",
        epId,
        "comments",
        parentId.commentId,
        "replies",
        parentIdd.replyId
      );

      // Reference to the specific document in animeComments collection
      const docRefAnimeComments = doc(
        db,
        "animeComments",
        anId,
        "comments",
        parentId.commentId,
        "replies",
        parentIdd.replyId
      );

      // Reference to the specific document in userComments collection
      const docRefUserComments = doc(
        db,
        "userComments",
        email,
        "replies",
        parentIdd.replyId
      );

      // Function to handle the like/dislike update logic
      const handleUpdate = async (docRef, collectionName) => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userLikeArray = docSnap.data().userLikes || []; // Make sure field name matches
          const userDislikeArray = docSnap.data().userDislikes || []; // Make sure field name matches
          const userDislikeCounts = docSnap.data().userDislikesCount || 0; // Make sure field name matches
          const userLikeCounts = docSnap.data().userLikesCount || 0; // Make sure field name matches

          console.log(`${collectionName} - Current userLikes: `, userLikeArray);
          console.log(
            `${collectionName} - Current userDislikes: `,
            userDislikeArray
          );

          if (userDislikeArray.includes(user)) {
            // User is in userDislike, remove from userDislike and add to userLike
            await updateDoc(docRef, {
              userDislikes: arrayRemove(user),
              userLikes: arrayUnion(user),
              userDislikesCount: userDislikeCounts - 1,
              userLikesCount: userLikeCounts + 1,
            });
            console.log(
              `${user} removed from userDislikes and added to userLikes in ${collectionName}`
            );
          } else if (userLikeArray.includes(user)) {
            // User is in userLike, remove from userLike
            await updateDoc(docRef, {
              userLikes: arrayRemove(user),
              userLikesCount: userLikeCounts - 1,
            });
            console.log(`${user} removed from userLikes in ${collectionName}`);
          } else {
            // User is in neither array, add them to userLike
            await updateDoc(docRef, {
              userLikes: arrayUnion(user),
              userLikesCount: userLikeCounts + 1,
            });
            console.log(`${user} added to userLikes in ${collectionName}`);
          }
        } else {
          console.log(`No such document in ${collectionName}`);
        }
      };

      // Update each collection
      await handleUpdate(docRefAnime, "anime");
      await handleUpdate(docRefAnimeComments, "animeComments");
      await handleUpdate(docRefUserComments, "userComments");

      const docSnap = await getDoc(docRefAnimeComments);
      setRepliesData(docSnap.data());

      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const manageDislike = async (
    anId,
    epId,
    parentId,
    email,
    userName,
    imageUrl
  ) => {
    const user = userName;
    try {
      // Reference to the specific document in anime collection
      const docRefAnime = doc(
        db,
        "anime",
        anId,
        "episodes",
        epId,
        "comments",
        parentId.commentId
      );

      // Reference to the specific document in animeComments collection
      const docRefAnimeComments = doc(
        db,
        "animeComments",
        anId,
        "comments",
        parentId.commentId
      );

      // Reference to the specific document in userComments collection
      const docRefUserComments = doc(
        db,
        "userComments",
        email,
        "comments",
        parentId.commentId
      );

      // Function to handle the like/dislike update logic
      const handleUpdate = async (docRef, collectionName) => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userLikeArray = docSnap.data().userLikes || []; // Make sure field name matches
          const userDislikeArray = docSnap.data().userDislikes || []; // Make sure field name matches
          const userDislikeCounts = docSnap.data().userDislikesCount || 0; // Make sure field name matches
          const userLikeCounts = docSnap.data().userLikesCount || 0; // Make sure field name matches

          console.log(`${collectionName} - Current userLikes: `, userLikeArray);
          console.log(
            `${collectionName} - Current userDislikes: `,
            userDislikeArray
          );

          if (userLikeArray.includes(user)) {
            // User is in userDislike, remove from userDislike and add to userLike
            await updateDoc(docRef, {
              userDislikes: arrayUnion(user),
              userLikes: arrayRemove(user),
              userDislikesCount: userDislikeCounts + 1,
              userLikesCount: userLikeCounts - 1,
            });
            console.log(
              `${user} removed from userDislikes and added to userLikes in ${collectionName}`
            );
          } else if (userDislikeArray.includes(user)) {
            // User is in userLike, remove from userLike
            await updateDoc(docRef, {
              userDislikes: arrayRemove(user),
              userDislikesCount: userDislikeCounts - 1,
            });
            console.log(`${user} removed from userLikes in ${collectionName}`);
          } else {
            // User is in neither array, add them to userLike
            await updateDoc(docRef, {
              userDislikes: arrayUnion(user),
              userDislikesCount: userDislikeCounts + 1,
            });
            console.log(`${user} added to userLikes in ${collectionName}`);
          }
        } else {
          console.log(`No such document in ${collectionName}`);
        }
      };

      // Update each collection
      await handleUpdate(docRefAnime, "anime");
      await handleUpdate(docRefAnimeComments, "animeComments");
      await handleUpdate(docRefUserComments, "userComments");

      const docSnap = await getDoc(docRefAnimeComments);
      setCommentsData(docSnap.data());

      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  const manageReplyDislike = async (
    anId,
    epId,
    parentId,
    parentIdd,
    email,
    userName,
    imageUrl
  ) => {
    const user = userName;
    try {
      // Reference to the specific document in anime collection
      const docRefAnime = doc(
        db,
        "anime",
        anId,
        "episodes",
        epId,
        "comments",
        parentId.commentId,
        "replies",
        parentIdd.replyId
      );

      // Reference to the specific document in animeComments collection
      const docRefAnimeComments = doc(
        db,
        "animeComments",
        anId,
        "comments",
        parentId.commentId,
        "replies",
        parentIdd.replyId
      );

      // Reference to the specific document in userComments collection
      const docRefUserComments = doc(
        db,
        "userComments",
        email,
        "replies",
        parentIdd.replyId
      );

      // Function to handle the like/dislike update logic
      const handleUpdate = async (docRef, collectionName) => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userLikeArray = docSnap.data().userLikes || []; // Make sure field name matches
          const userDislikeArray = docSnap.data().userDislikes || []; // Make sure field name matches
          const userDislikeCounts = docSnap.data().userDislikesCount || 0; // Make sure field name matches
          const userLikeCounts = docSnap.data().userLikesCount || 0; // Make sure field name matches

          console.log(`${collectionName} - Current userLikes: `, userLikeArray);
          console.log(
            `${collectionName} - Current userDislikes: `,
            userDislikeArray
          );

          if (userLikeArray.includes(user)) {
            // User is in userDislike, remove from userDislike and add to userLike
            await updateDoc(docRef, {
              userDislikes: arrayUnion(user),
              userLikes: arrayRemove(user),
              userDislikesCount: userDislikeCounts + 1,
              userLikesCount: userLikeCounts - 1,
            });
            console.log(
              `${user} removed from userDislikes and added to userLikes in ${collectionName}`
            );
          } else if (userDislikeArray.includes(user)) {
            // User is in userLike, remove from userLike
            await updateDoc(docRef, {
              userDislikes: arrayRemove(user),
              userDislikesCount: userDislikeCounts - 1,
            });
            console.log(`${user} removed from userLikes in ${collectionName}`);
          } else {
            // User is in neither array, add them to userLike
            await updateDoc(docRef, {
              userDislikes: arrayUnion(user),
              userDislikesCount: userDislikeCounts + 1,
            });
            console.log(`${user} added to userLikes in ${collectionName}`);
          }
        } else {
          console.log(`No such document in ${collectionName}`);
        }
      };

      // Update each collection
      await handleUpdate(docRefAnime, "anime");
      await handleUpdate(docRefAnimeComments, "animeComments");
      await handleUpdate(docRefUserComments, "userComments");

      console.log("All documents updated successfully");
      const docSnap = await getDoc(docRefAnimeComments);
      setRepliesData(docSnap.data());
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

  // Handle adding comment
  const handleOnEnter = async (text) => {
    if (userName) {
      if (text.trim() && anId && epId) {
        setComment("");
        await addComment(
          anId,
          epId,
          text,
          email,
          userName,
          props.epiod,
          imageUrl
        );
      }
    }
  };

  const handleOnLikeComment = async (commentId) => {
    if (userName) {
      await manageLike(anId, epId, { commentId }, email, userName, imageUrl);
      setLikeTo(null);
    }
  };

  const handleOnLikeReply = async (commentId, replyId) => {
    if (userName) {
      if (anId && epId) {
        await manageReplyLike(
          anId,
          epId,
          { commentId },
          { replyId },
          email,
          userName,
          imageUrl
        );
        setLikeTo(null);
      }
    }
  };

  const handleOnDislikeComment = async (commentId) => {
    if (userName) {
      if (anId && epId) {
        await manageDislike(
          anId,
          epId,
          { commentId },
          email,
          userName,
          imageUrl
        );
        setDislikeTo(null);
      }
    }
  };

  const handleOnDislikeReply = async (commentId, replyId) => {
    if (userName) {
      if (anId && epId) {
        await manageReplyDislike(
          anId,
          epId,
          { commentId },
          { replyId },
          email,
          userName,
          imageUrl
        );
        setDislikeTo(null);
      }
    }
  };

  // Handle adding reply or nested reply
  const handleReplySubmit = async () => {
    if (userName) {
      if (reply.trim() && anId && epId && replyTo) {
        setReply("");
        const { commentId, replyId } = replyTo;
        await addReply(
          anId,
          epId,
          { commentId },
          reply,
          email,
          userName,
          props.epiod,
          imageUrl,
          replyId
        ); // Pass replyId if replying to a reply
        setReplyTo(null); // Reset after submission
      }
    }
  };

  function timeAgo(timestamp) {
    // Ensure timestamp is treated as a number and create a Date object
    const currentTime = new Date();
    const time = new Date(Number(timestamp)); // Parse timestamp to Date object

    const timeDifference = Math.floor((currentTime - time) / 1000); // Time difference in seconds
    let interval = Math.floor(timeDifference / 3600); // Convert to hours

    if (interval >= 24) {
      return `${Math.floor(interval / 24)} days ago`;
    }
    if (interval >= 1) {
      return `${interval} hours ago`;
    }
    interval = Math.floor(timeDifference / 60); // Convert to minutes
    if (interval >= 1) {
      return `${interval} minutes ago`;
    }
    return `${timeDifference} seconds ago`;
  }

  const [toggleReplies, setToggleReplies] = useState({});

  const selectionH = (index, count) => {
    setToggleReplies((prevState) => ({
      ...prevState,
      [index]:
        prevState[index] === `Hide ${count} replies`
          ? `View ${count} replies`
          : `Hide ${count} replies`,
    }));
  };
  const router = useRouter();

  const logg = () => {
    if (!session) {
      setLogIsOpen(true)
    }
  };
  return (
    <>
      <SignInSignUpModal setLogIsOpen={setLogIsOpen} logIsOpen={logIsOpen} />

      <div className="heading-Com">Comments</div>
      <div className="igg">
        <div className="upperBir">
          <div className="startBir">
            <div className="dropdown-container">
              <div className="startOir">
                {selectOne} <FaAngleDown />
              </div>
              <div className="selectOne">
                <div
                  className={`selectOneOne ${
                    selectOne === `Episode ${props.epiod}` ? "drakiBir" : ""
                  }`}
                  onClick={() => setSelectOne(`Episode ${props.epiod}`)}
                >
                  <div className="mainBir">Episode {props.epiod}</div>{" "}
                  {selectOne === `Episode ${props.epiod}` ? (
                    <div className="secBir">
                      <SiTicktick />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`selectOneTwo ${
                    selectOne === `All Episodes` ? "drakiBir" : ""
                  }`}
                  onClick={() => setSelectOne(`All Episodes`)}
                >
                  <div className="mainBir">All Episodes</div>{" "}
                  {selectOne === `All Episodes` ? (
                    <div className="secBir">
                      <SiTicktick />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="middleBir">|</div>
            <div className="startTir">
              {" "}
              <FaRegCommentAlt />
              <div className="boldiBir">
                {selectOne === `Episode ${props.epiod}`
                  ? currentEpisodeCount
                  : allEpisodesCount}{" "}
                Comments
              </div>
            </div>
          </div>
          <div className="endBir">
            <div className="dropdown-container">
              <div className="startOir">
                Sort by <TbCaretUpDownFilled />
              </div>
              <div className="selectOne">
                <div
                  className={`selectOneOne ${
                    selectTwo === `Top` ? "drakiBir" : ""
                  }`}
                  onClick={() => setSelectTwo(`Top`)}
                >
                  <div className="mainBir">Top</div>{" "}
                  {selectTwo === `Top` ? (
                    <div className="secBir">
                      <SiTicktick />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`selectOneTwo ${
                    selectTwo === `Newest` ? "drakiBir" : ""
                  }`}
                  onClick={() => setSelectTwo(`Newest`)}
                >
                  <div className="mainBir">Newest</div>{" "}
                  {selectTwo === `Newest` ? (
                    <div className="secBir">
                      <SiTicktick />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`selectOneTwo ${
                    selectTwo === `Oldest` ? "drakiBir" : ""
                  }`}
                  onClick={() => setSelectTwo(`Oldest`)}
                >
                  <div className="mainBir">Oldest</div>{" "}
                  {selectTwo === `Oldest` ? (
                    <div className="secBir">
                      <SiTicktick />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>{" "}
          </div>
        </div>

        {/* Input Section */}
        <div className="middBir">
          <div>
            <img
              src={imageUrl} // Use the provided imageUrl
              className="profiy"
              alt=""
            />
          </div>
          <div className="middAge">
            {props.userName ? (
              <div className="middMess">
                <div>Comment as</div>
                <div className="logg-col">{props.userName}</div>
              </div>
            ) : (
              <div className="middMess">
                <div>You must be</div>
                <div className="logg-col">{" " + " login" + " "}</div>{" "}
                <div>to post a comment</div>
              </div>
            )}
            <div className="inputMess" onClick={() => logg()}>
              <div className="inputContainer">
                <InputEmoji
                  value={comment}
                  onChange={setComment}
                  cleanOnEnter
                  onEnter={handleOnEnter}
                  placeholder="leave a comment"
                  fontSize={16}
                  borderRadius={8}
                  className="input"
                />
              </div>
              <div className="buttonContainer">
                <button
                  className="button"
                  onClick={() => handleOnEnter(comment)}
                >
                  <BsSendFill size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="specialInputMess" onClick={() => logg()}>
          <div className="specialInputContainer">
            <InputEmoji
              value={comment}
              onChange={setComment}
              cleanOnEnter
              onEnter={handleOnEnter}
              placeholder="leave a comment"
              fontSize={16}
              borderRadius={8}
              className="specialInput"
            />
          </div>
          <div className="specialButtonContainer">
            <button
              className="specialButton"
              onClick={() => handleOnEnter(comment)}
            >
              <BsSendFill size={20} />
            </button>
          </div>
        </div>

        {/* Display comments and replies */}
        {selectOne === `Episode ${props.epiod}` ? (
          <div>
            {comments?.map((commentData, index) => (
              <div key={commentData.commentId}>
                <div className="tuggi">
                  <img
                    src={
                      commentData.imageUrl ||
                      "https://hianime.to/images/no-avatar.jpeg"
                    }
                    className="profiy"
                    alt="user profile"
                  />
                  <div className="gropi">
                    <div className="gropiPart">
                      <div className="i-head">
                        <div className="userN">
                          {commentData.userName || commentData.email}
                        </div>
                        <div className="timeAgo-t">
                          {timeAgo(commentData.commentId.split("_")[0])}
                        </div>
                      </div>

                      <div className="c-txt">{commentData.text}</div>
                      <div className="butt-o">
                        <button
                          className="fl1"
                          onClick={() =>
                            setReplyTo({ commentId: commentData.commentId }) &
                            setReply(commentData.userName + " ") &
                            logg()
                          }
                        >
                          <FaReply /> Reply
                        </button>
                        <button
                          className="fl1"
                          onClick={() =>
                            handleOnLikeComment(commentData.commentId) &
                            setLikeTo(commentData.commentId) &
                            logg()
                          }
                        >
                          {commentData.userLikes.some(
                            (user) => user === userName
                          ) ? (
                            <BiSolidLike size={17} />
                          ) : (
                            <BiLike size={17} />
                          )}
                          {commentData.userLikes
                            ? commentData.userLikes.length > 0
                              ? commentData.userLikes.length
                              : ""
                            : ""}{" "}
                        </button>

                        <button
                          className="fl1"
                          onClick={() =>
                            handleOnDislikeComment(commentData.commentId) &
                            setDislikeTo(commentData.commentId) &
                            logg()
                          }
                        >
                          {" "}
                          {commentData.userDislikes.some(
                            (user) => user === userName
                          ) ? (
                            <BiSolidDislike size={17} />
                          ) : (
                            <BiDislike size={17} />
                          )}
                          {commentData.userDislikes
                            ? commentData.userDislikes.length > 0
                              ? commentData.userDislikes.length
                              : ""
                            : ""}
                        </button>
                        {/* <button>..More</button> */}
                      </div>
                    </div>
                    {/* Show reply input if this comment is being replied to */}
                    {replyTo?.commentId === commentData.commentId &&
                      !replyTo.replyId && (
                        <div className="inputReplyContainer">
                          <InputEmoji
                            value={reply}
                            onChange={setReply}
                            placeholder="leave a reply"
                            fontSize={16}
                            borderRadius={8}
                            className="input"
                          />
                          <div className="buttonContainer">
                            <button
                              className="button"
                              onClick={handleReplySubmit}
                            >
                              <BsSendFill size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    {commentData.replies.length > 0 ? (
                      <div
                        onClick={() =>
                          selectionH(index, commentData.replies.length)
                        }
                      >
                        {toggleReplies[index] ? (
                          toggleReplies[index] ===
                          `Hide ${commentData.replies.length} replies` ? (
                            <div className="unf">
                              <FaCaretUp />
                              <div>{toggleReplies[index]}</div>
                            </div>
                          ) : (
                            <div className="unf">
                              <FaCaretDown />
                              <div>{`View ${commentData.replies.length} replies`}</div>
                            </div>
                          )
                        ) : (
                          <div className="unf">
                            <FaCaretDown />
                            <div>{`View ${commentData.replies.length} replies`}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {/* Display replies */}
                    {toggleReplies[index] ===
                    `Hide ${commentData.replies.length} replies` ? (
                      <div className="captur">
                        {commentData.replies &&
                          commentData.replies.map((replyData) => (
                            <div key={replyData.replyId} className="marginaL">
                              <div className="fuggi">
                                <img
                                  src={
                                    replyData.imageUrl ||
                                    "https://hianime.to/images/no-avatar.jpeg"
                                  }
                                  className="profiy"
                                  alt="user profile"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <div className="gropi">
                                  <div className="gropiPart">
                                    <div className="i-head">
                                      <div className="userN">
                                        {replyData.userName || replyData.email}
                                      </div>
                                      <div className="timeAgo-t">
                                        {timeAgo(
                                          replyData.commentId.split("_")[0]
                                        )}
                                      </div>
                                    </div>
                                    <div className="texaxo">
                                      <div className="theme-col">
                                        {"@" + replyData.userName}
                                      </div>
                                      <div>
                                        {replyData.text.replace(
                                          replyData.userName,
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="butt-o">
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          setReplyTo({
                                            commentId: commentData.commentId,
                                            replyId: replyData.replyId,
                                          }) &
                                          setReply(commentData.userName + " ") &
                                          logg()
                                        }
                                      >
                                        <FaReply /> Reply
                                      </button>
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          handleOnLikeReply(
                                            commentData.commentId,
                                            replyData.replyId
                                          ) &
                                          setLikeTo(commentData.commentId) &
                                          logg()
                                        }
                                      >
                                        {replyData.userLikes.some(
                                          (user) => user === userName
                                        ) ? (
                                          <BiSolidLike size={17} />
                                        ) : (
                                          <BiLike size={17} />
                                        )}
                                        {replyData.userLikes
                                          ? replyData.userLikes.length > 0
                                            ? replyData.userLikes.length
                                            : ""
                                          : ""}{" "}
                                      </button>
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          handleOnDislikeReply(
                                            commentData.commentId,
                                            replyData.replyId
                                          ) &
                                          setDislikeTo(commentData.commentId) &
                                          logg()
                                        }
                                      >
                                        {" "}
                                        {replyData.userDislikes.some(
                                          (user) => user === userName
                                        ) ? (
                                          <BiSolidDislike size={17} />
                                        ) : (
                                          <BiDislike size={17} />
                                        )}
                                        {replyData.userDislikes
                                          ? replyData.userDislikes.length > 0
                                            ? replyData.userDislikes.length
                                            : ""
                                          : ""}
                                      </button>
                                      {/* <button>..More</button> */}
                                    </div>
                                  </div>
                                  {/* Show reply input if this reply is being replied to */}
                                  {replyTo?.replyId === replyData.replyId && (
                                    <div className="inputReplyContainer">
                                      <InputEmoji
                                        value={reply}
                                        onChange={setReply}
                                        placeholder="leave a reply"
                                        fontSize={16}
                                        borderRadius={8}
                                        className="input"
                                      />
                                      <div className="buttonContainer">
                                        <button
                                          className="button"
                                          onClick={handleReplySubmit}
                                        >
                                          <BsSendFill size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {replyTo?.replyId === replyData.replyId && (
                                <div className="specialInputReplyContainer">
                                  <InputEmoji
                                    value={reply}
                                    onChange={setReply}
                                    placeholder="leave a reply"
                                    fontSize={16}
                                    borderRadius={8}
                                    className="specialInput"
                                  />
                                  <div className="specialButtonContainer">
                                    <button
                                      className="specialButton"
                                      onClick={handleReplySubmit}
                                    >
                                      <BsSendFill size={20} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {replyTo?.commentId === commentData.commentId &&
                  !replyTo.replyId && (
                    <div className="specialInputRepContainer">
                      <InputEmoji
                        value={reply}
                        onChange={setReply}
                        placeholder="leave a reply"
                        fontSize={16}
                        borderRadius={8}
                        className="specialInput"
                      />
                      <div className="specialButtonContainer">
                        <button
                          className="specialButton"
                          onClick={handleReplySubmit}
                        >
                          <BsSendFill size={20} />
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
        {selectOne === `All Episodes` ? (
          <div>
            {allComments?.map((commentData, index) => (
              <div key={commentData.commentId}>
                <div className="tuggi">
                  <img
                    src={
                      commentData.imageUrl ||
                      "https://hianime.to/images/no-avatar.jpeg"
                    }
                    className="profiy"
                    alt="user profile"
                  />
                  <div className="gropi">
                    <div className="gropiPart">
                      <div className="i-head">
                        <div className="userN">
                          {commentData.userName || commentData.email}
                        </div>
                        <div className="timeAgo-t">
                          {timeAgo(commentData.commentId.split("_")[0])}
                        </div>
                        <div className="timeAgo-l">
                          <FaCaretLeft />
                          <div>{`Episode ${commentData.episodeNo}`}</div>
                        </div>
                      </div>
                      <div className="timeAgo-cam">
                        <FaCaretLeft />
                        <div>{`Episode ${commentData.episodeNo}`}</div>
                      </div>

                      <div className="c-txt">{commentData.text}</div>
                      <div className="butt-o">
                        <button
                          className="fl1"
                          onClick={() =>
                            setReplyTo({ commentId: commentData.commentId }) &
                            setReply(commentData.userName + " ") &
                            logg()
                          }
                        >
                          <FaReply /> Reply
                        </button>
                        <button
                          className="fl1"
                          onClick={() =>
                            handleOnLikeComment(commentData.commentId) &
                            setLikeTo(commentData.commentId) &
                            logg()
                          }
                        >
                          {commentData.userLikes.some(
                            (user) => user === userName
                          ) ? (
                            <BiSolidLike size={17} />
                          ) : (
                            <BiLike size={17} />
                          )}
                          {commentData.userLikes
                            ? commentData.userLikes.length > 0
                              ? commentData.userLikesCount
                              : ""
                            : ""}{" "}
                        </button>

                        <button
                          className="fl1"
                          onClick={() =>
                            handleOnDislikeComment(commentData.commentId) &
                            setDislikeTo(commentData.commentId) &
                            logg()
                          }
                        >
                          {" "}
                          {commentData.userDislikes.some(
                            (user) => user === userName
                          ) ? (
                            <BiSolidDislike size={17} />
                          ) : (
                            <BiDislike size={17} />
                          )}
                          {commentData.userDislikes
                            ? commentData.userDislikes.length > 0
                              ? commentData.userDislikesCount
                              : ""
                            : ""}
                        </button>
                        {/* <button>..More</button> */}
                      </div>
                    </div>

                    {/* Show reply input if this comment is being replied to */}
                    {replyTo?.commentId === commentData.commentId &&
                      !replyTo.replyId && (
                        <div className="inputReplyContainer">
                          <InputEmoji
                            value={reply}
                            onChange={setReply}
                            placeholder="leave a reply"
                            fontSize={16}
                            borderRadius={8}
                            className="input"
                          />
                          <div className="buttonContainer">
                            <button
                              className="button"
                              onClick={handleReplySubmit}
                            >
                              <BsSendFill size={20} />
                            </button>
                          </div>
                        </div>
                      )}
                    {commentData.replies.length > 0 ? (
                      <div
                        onClick={() =>
                          selectionH(index, commentData.replies.length)
                        }
                      >
                        {toggleReplies[index] ? (
                          toggleReplies[index] ===
                          `Hide ${commentData.replies.length} replies` ? (
                            <div className="unf">
                              <FaCaretUp />
                              <div>{toggleReplies[index]}</div>
                            </div>
                          ) : (
                            <div className="unf">
                              <FaCaretDown />
                              <div>{`View ${commentData.replies.length} replies`}</div>
                            </div>
                          )
                        ) : (
                          <div className="unf">
                            <FaCaretDown />
                            <div>{`View ${commentData.replies.length} replies`}</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    {/* Display replies */}
                    {toggleReplies[index] ===
                    `Hide ${commentData.replies.length} replies` ? (
                      <div className="captur">
                        {commentData.replies &&
                          commentData.replies.map((replyData) => (
                            <div key={replyData.replyId} className="marginaL">
                              <div className="fuggi">
                                <img
                                  src={
                                    replyData.imageUrl ||
                                    "https://hianime.to/images/no-avatar.jpeg"
                                  }
                                  className="profiy"
                                  alt="user profile"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                  }}
                                />
                                <div className="gropi">
                                  <div className="gropiPart">
                                    <div className="i-head">
                                      <div className="userN">
                                        {replyData.userName || replyData.email}
                                      </div>
                                      <div className="timeAgo-t">
                                        {timeAgo(
                                          replyData.commentId.split("_")[0]
                                        )}
                                      </div>
                                      <div className="timeAgo-l">
                                        <FaCaretLeft />
                                        <div>{`Episode ${replyData.episodeNo}`}</div>
                                      </div>
                                    </div>
                                    <div className="texaxo">
                                      <div className="theme-col">
                                        {"@" + replyData.userName}
                                      </div>
                                      <div>
                                        {replyData.text.replace(
                                          replyData.userName,
                                          ""
                                        )}
                                      </div>
                                    </div>
                                    <div className="butt-o">
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          setReplyTo({
                                            commentId: commentData.commentId,
                                            replyId: replyData.replyId,
                                          }) &
                                          setReply(commentData.userName + " ") &
                                          logg()
                                        }
                                      >
                                        <FaReply /> Reply
                                      </button>
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          handleOnLikeReply(
                                            commentData.commentId,
                                            replyData.replyId
                                          ) &
                                          setLikeTo(commentData.commentId) &
                                          logg()
                                        }
                                      >
                                        {replyData.userLikes.some(
                                          (user) => user === userName
                                        ) ? (
                                          <BiSolidLike size={17} />
                                        ) : (
                                          <BiLike size={17} />
                                        )}
                                        {replyData.userLikes
                                          ? replyData.userLikes.length > 0
                                            ? replyData.userLikesCount
                                            : ""
                                          : ""}{" "}
                                      </button>
                                      <button
                                        className="fl1"
                                        onClick={() =>
                                          handleOnDislikeReply(
                                            commentData.commentId,
                                            replyData.replyId
                                          ) &
                                          setDislikeTo(commentData.commentId) &
                                          logg()
                                        }
                                      >
                                        {" "}
                                        {replyData.userDislikes.some(
                                          (user) => user === userName
                                        ) ? (
                                          <BiSolidDislike size={17} />
                                        ) : (
                                          <BiDislike size={17} />
                                        )}
                                        {replyData.userDislikes
                                          ? replyData.userDislikes.length > 0
                                            ? replyData.userDislikesCount
                                            : ""
                                          : ""}
                                      </button>
                                      {/* <button>..More</button> */}
                                    </div>
                                  </div>
                                  {/* Show reply input if this reply is being replied to */}
                                  {replyTo?.replyId === replyData.replyId && (
                                    <div className="inputReplyContainer">
                                      <InputEmoji
                                        value={reply}
                                        onChange={setReply}
                                        placeholder="leave a reply"
                                        fontSize={16}
                                        borderRadius={8}
                                        className="input"
                                      />
                                      <div className="buttonContainer">
                                        <button
                                          className="button"
                                          onClick={handleReplySubmit}
                                        >
                                          <BsSendFill size={20} />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {replyTo?.replyId === replyData.replyId && (
                                <div className="specialInputReplyContainer">
                                  <InputEmoji
                                    value={reply}
                                    onChange={setReply}
                                    placeholder="leave a reply"
                                    fontSize={16}
                                    borderRadius={8}
                                    className="specialInput"
                                  />
                                  <div className="specialButtonContainer">
                                    <button
                                      className="specialButton"
                                      onClick={handleReplySubmit}
                                    >
                                      <BsSendFill size={20} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {replyTo?.commentId === commentData.commentId &&
                  !replyTo.replyId && (
                    <div className="specialInputRepContainer">
                      <InputEmoji
                        value={reply}
                        onChange={setReply}
                        placeholder="leave a reply"
                        fontSize={16}
                        borderRadius={8}
                        className="specialInput"
                      />
                      <div className="specialButtonContainer">
                        <button
                          className="specialButton"
                          onClick={handleReplySubmit}
                        >
                          <BsSendFill size={20} />
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Comments;
