import {Position} from "@/entities/board";
import {cn} from "@/shared/lib/css.ts";

export const Selection = ({startPoint, endPoint}: {startPoint: Position, endPoint: Position}) => {

    return (
        <div
            className={cn(
                "absolute border border-blue-500 bg-blue-500/20",
            )}
            style={{
                width: endPoint.x - startPoint.x,
                height: endPoint.y - startPoint.y,
                left: startPoint.x,
                top: startPoint.y,
            }}
        />
    )

}