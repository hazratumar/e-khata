import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomerDto } from "./create-customer.dto";
import { IsNotEmpty } from "class-validator";

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  @IsNotEmpty({ message: "Customer Id is required" })
  id: number;
}
