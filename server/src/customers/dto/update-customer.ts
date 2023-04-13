import { PartialType } from "@nestjs/mapped-types";

import { Customer } from "../entities/customer.entity";

export class UpdateCustomerDto extends PartialType(Customer) {}
