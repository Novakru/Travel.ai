import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

const DemoIndex: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        // 生成一个随机ID
        const randomId = uuidv4();
        // 重定向到带有随机ID的URL
        router.replace(`/demo/${randomId}`);
    }, [router]);

    return null; // 返回null，因为页面会立即重定向
};

export default DemoIndex;
