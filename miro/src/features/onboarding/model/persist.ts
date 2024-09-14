import {z} from "zod";
import {BoardId, NodeId} from "@/kernel/ids.ts";

const onboardingScheme = z.object({
    currentStep: z.string().optional(),
    isFinished: z.boolean(),
    boardId: BoardId.optional(),
    nodeId: NodeId.optional(),
});

export const getOnboardingState = () => {
    try {
        return onboardingScheme.parse(
            JSON.parse(localStorage.getItem("onboarding") ?? ""),
        );
    } catch (err) {
        return {
            currentStep: undefined,
            isFinished: false,
        };
    }
};

export const setOnboarding = (data: z.infer<typeof onboardingScheme>) => {
    localStorage.setItem("onboarding", JSON.stringify(data));
};
