"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Trash2, MoreVertical } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";
import { formatTimeAgo } from "@/src/lib/utils";
import Image from "next/image";

export default function PostCard({ post, onDelete, onLike }) {
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(post._count?.likes || 0);
	const [showMenu, setShowMenu] = useState(false);
	const { user } = useAuth();

	console.log("Post Data:", post); // Debug log
	console.log("Media URL:", post.mediaUrl); // Debug log

	const handleLike = async () => {
		try {
			const response = await fetch(`/api/posts/${post.id}/like`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setLiked(!liked);
				setLikeCount(data.likeCount);
				onLike?.(post.id);
			}
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this post?")) return;

		try {
			const response = await fetch(`/api/posts/${post.id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
				},
			});

			if (response.ok) {
				onDelete?.(post.id);
			}
		} catch (error) {
			console.error("Error deleting post:", error);
		}
	};

	const isAuthor = user?.userId === post.authorId;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition"
		>
			{/* Header */}
			<div className="p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
						{post.author?.name?.[0]?.toUpperCase() || "U"}
					</div>
					<div>
						<p className="font-semibold text-white">
							{post.author?.name || "Unknown User"}
						</p>
						<p className="text-xs text-gray-400">
							{formatTimeAgo(post.createdAt)}
						</p>
					</div>
				</div>

				{(isAuthor || user?.role === "ADMIN") && (
					<div className="relative">
						<button
							onClick={() => setShowMenu(!showMenu)}
							className="p-2 hover:bg-gray-700 rounded-full transition"
						>
							<MoreVertical className="w-5 h-5 text-gray-400" />
						</button>

						{showMenu && (
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10"
							>
								<button
									onClick={() => {
										handleDelete();
										setShowMenu(false);
									}}
									className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-800 text-red-400 transition text-sm"
								>
									<Trash2 className="w-4 h-4" />
									Delete Post
								</button>
							</motion.div>
						)}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4">
				<h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
				{post.description && (
					<p className="text-gray-300 text-sm mb-4">{post.description}</p>
				)}
			</div>

			{/* Media - FIXED VERSION */}
			{post.mediaUrl && (
				<div className="relative w-full overflow-hidden bg-gray-900">
					{post.type === "IMAGE" ? (
						<div className="relative w-full h-96">
							<Image
								src={post.mediaUrl}
								alt={post.title}
								fill
								className="object-cover w-full h-full"
								priority={false}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								onError={(e) => {
									console.error("Image failed to load:", post.mediaUrl);
									e.currentTarget.src = "/images/placeholder.jpg";
								}}
							/>
						</div>
					) : post.type === "VIDEO" ? (
						<video
							src={post.mediaUrl}
							className="w-full h-96 object-cover"
							controls
							controlsList="nodownload"
							poster={post.thumbnail}
						/>
					) : null}
				</div>
			)}

			{/* Stats and Actions */}
			<div className="p-4 border-t border-gray-700">
				<div className="flex items-center justify-between mb-3 text-sm text-gray-400">
					<span>{likeCount} likes</span>
					<span>{post._count?.comments || 0} comments</span>
					<span>{post.views || 0} views</span>
				</div>

				<div className="flex gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleLike}
						className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition ${
							liked
								? "bg-red-500/20 text-red-400"
								: "bg-gray-700/30 text-gray-400 hover:bg-gray-700/50"
						}`}
					>
						<Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
						Like
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 rounded-lg transition"
					>
						<MessageCircle className="w-5 h-5" />
						Comment
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}
