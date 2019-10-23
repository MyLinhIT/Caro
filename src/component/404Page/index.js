import { Result, Button } from 'antd';
import React from 'react'
import history from '../../history';

const PageNotFound = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Trang không được tìm thấy!!!"
            extra={<Button type="primary" onClick={() => history.push('/home')}>Quay về</Button>}
        />
    )
}

export default PageNotFound
