import { RetroChat } from "@/components/RetroChat";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full">
        <RetroChat />
        <p className="text-center mt-4 text-[10px] text-muted-foreground">
          ▲ PRESS START TO BEGIN ▲
        </p>
      </div>
    </div>
  );
};

export default Index;
