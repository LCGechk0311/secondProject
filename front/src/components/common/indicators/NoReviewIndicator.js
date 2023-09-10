import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserStateContext } from "../../../App";
import useModal, { MODAL_TYPE } from "../../../hooks/useModal";

const NoReviewIndicator = () => {
  const navigate = useNavigate();
  const { user: loggedInUser } = useContext(UserStateContext);
  const { setModalVisible } = useModal();
  return (
    <Card.Body className="flex-column-center-center card noReviewIndicator">
      <Card.Title>작성된 리뷰가 없습니다</Card.Title>
      <Card.Text>첫번째 게시물을 작성해보세요</Card.Text>
      {/* 클릭하면 setShowModal */}
      {loggedInUser ? (
        <Button
          variant="primary"
          className="mt-4"
          onClick={() =>
            setModalVisible({
              type: MODAL_TYPE.addReview,
              isVisible: true,
              data: null,
            })
          }
        >
          글 작성하기
        </Button>
      ) : (
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate("/login")}
        >
          로그인
        </Button>
      )}
    </Card.Body>
  );
};
export default NoReviewIndicator;
