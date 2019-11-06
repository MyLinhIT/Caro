import React from 'react'
import { Button, Modal } from 'antd';

const ModalCustom = ({
  visible,
  onCancel,
  onOk,
  title,
  content,
}) => {
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={[
        <Button key="back" onClick={onCancel} type="danger">
         Không
        </Button>,
        <Button key="submit" onClick={onOk} type="primary">
         Có
        </Button>
      ]}
    >
      {content}
    </Modal>
  );
};

export default ModalCustom;
