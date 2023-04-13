import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer";
import { UsersService } from "src/users/users.service";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly usersService: UsersService
  ) {}

  async create(
    userId,
    createCustomerDto: CreateCustomerDto
  ): Promise<Customer> {
    const user = await this.usersService.findOne(userId);
    const customer = { ...createCustomerDto, user };
    return this.customerRepository.save(customer);
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    // Input validation
    if (page < 1) {
      throw new Error("Page number must be greater than or equal to 1.");
    }

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = (page - 1) * limit;

    const length = await this.customerRepository.count();

    const totalPages = Math.ceil(length / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    const customers = await this.customerRepository.find({
      skip,
      take: limit,
      order: { updatedAt: "DESC" },
    });

    return { customers, total: length, page, totalPages };
  }

  async findOne(id: number): Promise<Customer> {
    // Find a costumer by their ID
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      // If no costumer with the given ID is found, throw an error
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  async update(
    id: number,
    userId: number,
    customer: UpdateCustomerDto
  ): Promise<Customer> {
    // Input validation
    if (!customer || Object.keys(customer).length === 0) {
      throw new HttpException("Invalid customer data", HttpStatus.BAD_REQUEST);
    }

    // Find the existing customer in the database
    const existingCustomer = await this.customerRepository.findOne({
      where: { id },
    });

    // If the customer doesn't exist, throw an error
    if (!existingCustomer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }

    // Merge the existing customer with the new data
    const updatedCustomer = { ...existingCustomer, ...customer };

    // Save the updated customer to the database
    return this.customerRepository.save(updatedCustomer);
  }

  async remove(id: number): Promise<void> {
    // Delete the costumer from the database
    const result = await this.customerRepository.delete({ id });
    // If no costumer was affected (i.e. the costumer doesn't exist), throw an error
    if (result.affected === 0) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
  }
}
