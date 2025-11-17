import FirePost from '@/components/FirePost/FirePost';

export default function Posts() {
    return (
        <div className="w-full h-full flex flex-col gap-6 p-4">
            <FirePost postShowType={['all', 'client']} />
        </div>
    );
}
