import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";

import * as hootService from "../../services/hootService";
import Loading from '../Loading/Loading';
import CommentForm from '../CommentForm/CommentForm';
import { AuthedUserContext } from "../../App";
import { Link } from 'react-router-dom';

const HootDetails = ({ handleDeleteHoot }) => {
    const { hootId } = useParams();
    // console.log("hootidddd: ", hootId);
    const [hoot, setHoot] = useState(null);

    const user = useContext(AuthedUserContext);

    useEffect(() => {
        const fetchHoot = async () => {
            const hootData = await hootService.show(hootId);
            // console.log("hootData: ", hootData);
            setHoot(hootData);
        }
        fetchHoot();
    }, [hootId]);

    const handleAddComment = async (commentFormData) => {
        // console.log("Comment Form Data: ", commentFormData);
        const newComment = await hootService.createComment(hootId, commentFormData);
        setHoot({ ...hoot, comments: [...hoot.comments, newComment] });
    }

    const handleDeleteComment = async (commentId) => {
        // console.log("Comment ID: ", commentId);
        await hootService.deleteComment(hootId, commentId);
        setHoot({
            ...hoot,
            comments: hoot.comments.filter((comment) => comment._id !== commentId),
        });
    }

    if (!hoot) return <Loading />;

    return (
        <main>
            <header>
                <p>{hoot.category.toUpperCase()}</p>
                <h1>{hoot.title}</h1>
                <p>
                    {hoot.author.username} posted on {new Date(hoot.createdAt).toLocaleDateString()}
                </p>
                {hoot.author._id === user._id && (
                    <>
                        <Link to={`/hoots/${hootId}/edit`}>Edit</Link>
                        <button onClick={() => handleDeleteHoot(hootId)}>Delete</button>
                    </>
                )}
            </header>
            
            <p>{hoot.text}</p>
            
            <section>
                <h2>Comments</h2>
                <CommentForm handleAddComment={handleAddComment} />

                {!hoot.comments.length && <p>There are no comments.</p>}

                {hoot.comments.map((comment) => (
                    <article key={comment._id}>
                        <header>
                            <p>
                                {comment.author.username} posted on {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                            {comment.author === user._id && (
                                <>
                                    <Link to={`/hoots/${hootId}/comments/${comment._id}/edit`}>Edit</Link>
                                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                </>
                            )}

                        </header>

                        <p>{comment.text}</p>
                    </article>
                ))}
            </section>
        </main>
    )
  };
  
  export default HootDetails;