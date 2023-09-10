import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ModalVisibleContext, UserStateContext } from "../../../App";
import * as Api from "../../../Api";
import { MODAL_TYPE } from "../../../hooks/useModal";

const CommentForm = ({
  review,
  setNewComments,
  setModalNewComments,
  setReviews,
  setCommentCount,
}) => {
  const { user: loggedInUser } = useContext(UserStateContext);
  const { modalVisible } = useContext(ModalVisibleContext);
  // 부모 컴포넌트로부터 데이터를 받을 수 있다(리뷰 페이지에서 작성되는 경우)
  // 모달창에서 작성하는 경우 context로 전달받은 데이터를 사용한다
  const targetReview = review ? review : modalVisible?.data?.review;
  const [newCommentValue, setNewCommentValue] = useState("");
  const isValid = newCommentValue.length > 0 && newCommentValue.length <= 100;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!loggedInUser) {
        alert("유저 없음");
      }
      // 글자수 제한: 1글자이상 100자이하
      if (!isValid) {
        return;
      }

      const res = await Api.post(`comments/${targetReview._id}`, {
        content: newCommentValue,
      });
      const updatedComment = res.data;
      if (!updatedComment) {
        return alert("요청 실패");
      }

      setNewComments((current) => [...current, updatedComment]);

      if (modalVisible.type === MODAL_TYPE.commentsList) {
        setModalNewComments((current) => [...current, updatedComment]);
      }

      setCommentCount((current) => current + 1);

      setNewCommentValue("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form onSubmit={handleCommentSubmit} className="comment__form">
      <input
        value={newCommentValue}
        onChange={(e) => {
          setNewCommentValue(e.target.value);
        }}
        placeholder="댓글 달기..."
        className="comment__input comment__border "
      />
      {newCommentValue?.length > 0 && (
        <Button
          onClick={handleCommentSubmit}
          variant="outline-primary"
          className="comment__submit-btn"
        >
          게시
        </Button>
      )}
    </Form>
  );
};

export default CommentForm;
