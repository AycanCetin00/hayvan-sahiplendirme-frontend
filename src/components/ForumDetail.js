import React, { useCallback, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../styles/ForumDetail.css";

const API_URL = "http://localhost:7001/api/forum";

const ForumDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(true);

  const [currentUser] = useState(() => {
    try {
      const storedUser =
        localStorage.getItem("currentUser") || localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString("tr-TR");
  };

  const fetchPostAndComments = useCallback(async () => {
    try {
      setLoading(true);

      const [postRes, commentsRes] = await Promise.all([
        fetch(`${API_URL}/posts/${id}`),
        fetch(`${API_URL}/posts/${id}/comments`),
      ]);

      if (!postRes.ok) throw new Error("Yazı alınamadı");
      if (!commentsRes.ok) throw new Error("Yorumlar alınamadı");

      const postData = await postRes.json();
      const commentsData = await commentsRes.json();

      const normalized = Array.isArray(commentsData)
        ? commentsData
        : Array.isArray(commentsData.comments)
          ? commentsData.comments
          : Array.isArray(commentsData.data)
            ? commentsData.data
            : [];

      setComments(normalized);
      setPost(postData || null);
    } catch (err) {
      setPost(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content) return;

    if (!currentUser?.id) {
      alert("Yorum yapabilmek için giriş yapmalısınız.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, content }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Yorum gönderilemedi");
      }

      setNewComment("");
      await fetchPostAndComments();
    } catch (err) {
      alert("Yorum eklenirken hata oluştu: " + err.message);
    }
  };

  const handleOpenReply = (comment) => {
    setActiveReplyCommentId((prev) =>
      prev === comment.id ? null : comment.id,
    );
    setReplyDrafts((prev) => ({
      ...prev,
      [comment.id]: prev[comment.id] || "",
    }));
  };

  const handleReplyDraftChange = (commentId, value) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleAddReply = async (commentId) => {
    const draft = (replyDrafts[commentId] || "").trim();
    if (!draft) return;

    if (!currentUser?.id) {
      alert("Cevap yazabilmek için giriş yapmalısınız.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: draft,
          parent_comment_id: commentId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Cevap gönderilemedi");
      }

      setReplyDrafts((prev) => ({ ...prev, [commentId]: "" }));
      setActiveReplyCommentId(null);
      await fetchPostAndComments();
    } catch (err) {
      alert("Cevap eklenirken hata oluştu: " + err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!currentUser?.id || !post?.id) return;

    const shouldDelete = window.confirm(
      "Bu yazıyı silmek istediğinize emin misiniz?",
    );
    if (!shouldDelete) return;

    try {
      const res = await fetch(`${API_URL}/posts/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Yazı silinemedi");
      }

      alert("Yazı silindi.");
      navigate("/forum");
    } catch (err) {
      alert(err.message || "Yazı silinirken hata oluştu");
    }
  };

  // Ağaç yapısını düz listeye çeviren yardımcı fonksiyon
  const flattenReplies = (replies) => {
    const result = [];
    const traverse = (items) => {
      items.forEach((item) => {
        result.push(item);
        if (item.replies && item.replies.length > 0) {
          traverse(item.replies);
        }
      });
    };
    traverse(replies);
    return result;
  };

  const renderReplies = (replies) => (
    <div className="reply-thread">
      {replies.map((reply) => (
        <div key={reply.id} className="reply">
          <div className="reply-header">
            <span className="reply-avatar">{reply.avatar || "👤"}</span>
            <div className="reply-author-info">
              <h6>{reply.author}</h6>
              <p className="reply-time">
                {formatDate(reply.created_at || reply.timestamp)}
              </p>
            </div>
          </div>
          <p className="reply-text">{reply.content}</p>
          {reply.replies &&
            reply.replies.length > 0 &&
            renderReplies(reply.replies)}
        </div>
      ))}
    </div>
  );

  const isPostOwner = Number(post?.user_id) === Number(currentUser?.id);

  if (loading) {
    return (
      <div className="forum-detail-container">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="forum-detail-container">
        <div className="error-message">
          <p>Yazı bulunamadı</p>
          <button onClick={() => navigate("/forum")}>Forum'a Geri Dön</button>
        </div>
      </div>
    );
  }

  const renderComment = (comment) => (
    <div key={comment.id} className="comment">
      <div className="comment-header">
        <span className="comment-avatar">{comment.avatar || "👤"}</span>
        <div className="comment-author-info">
          <h5>{comment.author}</h5>
          <p className="comment-time">
            {formatDate(comment.created_at || comment.timestamp)}
          </p>
        </div>
      </div>
      <p className="comment-text">{comment.content}</p>
      <div className="comment-actions">
        <button className="btn-reply" onClick={() => handleOpenReply(comment)}>
          ↩️ Cevapla
        </button>
      </div>
      {activeReplyCommentId === comment.id && (
        <div className="inline-reply-form">
          <textarea
            className="inline-reply-textarea"
            value={replyDrafts[comment.id] || ""}
            onChange={(e) => handleReplyDraftChange(comment.id, e.target.value)}
            rows="3"
            placeholder="Cevabınızı yazın..."
          />
          <div className="inline-reply-actions">
            <button
              className="btn-inline-cancel"
              onClick={() => setActiveReplyCommentId(null)}
            >
              Vazgeç
            </button>
            <button
              className="btn-inline-submit"
              onClick={() => handleAddReply(comment.id)}
              disabled={!(replyDrafts[comment.id] || "").trim()}
            >
              Gönder
            </button>
          </div>
        </div>
      )}
      {/* Alt cevaplar varsa onları da göster */}
      {comment.replies &&
        comment.replies.length > 0 &&
        renderReplies(comment.replies)}
    </div>
  );

  return (
    <div className="forum-detail-container">
      <button className="btn-back" onClick={() => navigate("/forum")}>
        ← Forum'a Geri Dön
      </button>

      <div className="forum-post">
        <div className="post-header">
          <div className="post-author">
            <span className="post-avatar">{post.avatar || "👤"}</span>
            <div className="post-author-info">
              <h4>{post.author}</h4>
              <p>{formatDate(post.created_at || post.timestamp)}</p>
            </div>
          </div>
          <div className="post-header-actions">
            <span className="post-category">{post.category}</span>
            {isPostOwner && (
              <button className="btn-delete-post" onClick={handleDeletePost}>
                Yazıyı Sil
              </button>
            )}
          </div>
        </div>

        <h1 className="post-title">{post.title}</h1>

        <div className="post-content">
          <p>{post.content}</p>
        </div>

        <div className="post-stats">
          <span>💬 {post.replies || 0} Cevap</span>
        </div>

        <div className="comments-section">
          <h2>Cevaplar ({comments.length})</h2>

          <div className="comment-form">
            <div className="form-header">
              <span className="user-avatar">👤</span>
              <p className="user-name">{currentUser?.name || "Misafir"}</p>
            </div>

            {!currentUser?.id && (
              <p className="comment-time">
                Yorum yazmak için giriş yapmanız gerekiyor.
              </p>
            )}

            <textarea
              className="comment-textarea"
              placeholder="Cevabınızı yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              disabled={!currentUser?.id}
            />

            <div className="form-actions">
              <button
                className="btn-submit-comment"
                onClick={handleAddComment}
                disabled={!currentUser?.id || !newComment.trim()}
              >
                Cevapla
              </button>
            </div>
          </div>

          <div className="comments-list">
            {comments.map((comment) => renderComment(comment))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumDetail;
