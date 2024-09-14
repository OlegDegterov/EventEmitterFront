/**
 * v0 by Vercel.
 * @see https://v0.dev/t/fQg3Fs17PWB
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/card.tsx";
import { Label } from "@/shared/ui/label.tsx";
import { Input } from "@/shared/ui/input.tsx";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select.tsx";
import { Button } from "@/shared/ui/button.tsx";
import { useQuery } from "@tanstack/react-query";
import { usersQueryOptions } from "@/entities/user";
import { citiesQueryOptions } from "@/entities/city";
import { getBankAccountQuery } from "@/entities/bank-account/api";
import { BankAccountId } from "@/shared/kernel";
import { useState } from "react";
import { BankAccount } from "@/entities/bank-account/model/domain";
import { queryClient } from "@/shared/api/instance";

const handleSubmit = async (data: Partial<BankAccount>) => {
  const bankAccount = await queryClient.fetchQuery({
    ...getBankAccountQuery(BankAccountId.parse("123")),
  });

  // send to server

  const sendToServer = { ...bankAccount, ...data };
  console.log(sendToServer);
};

export default function ManageBankAccount() {
  const { data: bankAccount } = useQuery({
    ...getBankAccountQuery(BankAccountId.parse("123")),
  });

  const [formState, setFormState] = useState<Partial<BankAccount>>({});

  const { data: users } = useQuery({ ...usersQueryOptions });
  const { data: cities } = useQuery({ ...citiesQueryOptions });

  const isDirty = Object.values(formState).length > 0;

  const reset = () => {
    setFormState({});
  };

  const sumbit = () => {
    handleSubmit(formState);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Bank Account Details</CardTitle>
        <CardDescription>
          Enter your bank account information to set up direct deposit.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input
            id="account-number"
            type="number"
            placeholder="Enter account number"
            value={formState.accountNumber ?? bankAccount?.accountNumber}
            onChange={(e) => {
              setFormState({
                ...formState,
                accountNumber: Number(e.target.value),
              });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="routing-number">Routing Number</Label>
          <Input
            id="routing-number"
            type="number"
            placeholder="Enter routing number"
            value={formState.routingNumber ?? bankAccount?.routingNumber}
            onChange={(e) =>
              setFormState({
                ...formState,
                routingNumber: Number(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="user">User</Label>
          <Select
            value={formState.userId ?? bankAccount?.userId}
            onValueChange={(value) =>
              setFormState({ ...formState, userId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => {
                return (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Select
            value={formState.cityId ?? bankAccount?.cityId}
            onValueChange={(value) =>
              setFormState({ ...formState, cityId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities?.map((city) => {
                return (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          className="ml-auto"
          disabled={!isDirty}
          onClick={sumbit}
        >
          Submit
        </Button>
        <Button
          type="button"
          className="ml-auto"
          disabled={!isDirty}
          onClick={reset}
        >
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
