import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Like, Repository } from "typeorm";
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
    userId: number,
    createCustomerDto: CreateCustomerDto
  ): Promise<Customer> {
    const user = await this.usersService.findOne(userId);

    const isDuplicateName = await this.findByName(createCustomerDto.name);
    if (isDuplicateName) {
      throw new HttpException(
        "The customer name already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    const customer = { ...createCustomerDto, user };
    return this.customerRepository.save(customer);
  }
  async find(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{
    customers: Customer[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100.");
    }

    const skip = page * limit;

    const queryBuilder = this.customerRepository.createQueryBuilder("customer");

    // Apply search filter if search term is provided
    if (search?.trim()) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where("customer.name ILIKE :search", { search: `%${search}%` })
            .orWhere("customer.nickname ILIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("customer.phone ILIKE :search", { search: `%${search}%` })
            .orWhere("customer.address ILIKE :search", {
              search: `%${search}%`,
            })
            .orWhere("customer.other ILIKE :search", { search: `%${search}%` });
        })
      );
    }

    const length = await queryBuilder.getCount();

    const totalPages = Math.ceil(length / limit);

    // Handle case when page number is greater than total pages
    if (totalPages > 0 && page > totalPages) {
      throw new Error(
        `Page number must be less than or equal to ${totalPages}.`
      );
    }

    const customers = await queryBuilder
      .orderBy("customer.updatedAt", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    return { customers, total: length, page, totalPages };
  }

  async findOne(id: number): Promise<Customer> {
    return this.customerRepository.findOne({ where: { id } });
  }
  async findByName(name: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { name } });
  }
  async update(id: number, customer: UpdateCustomerDto): Promise<Customer> {
    // Input validation
    if (!customer || Object.keys(customer).length === 0) {
      throw new HttpException("Invalid customer data", HttpStatus.BAD_REQUEST);
    }
    const existingCustomer = await this.findOne(id);
    if (!existingCustomer) {
      throw new HttpException("Customer not found", HttpStatus.NOT_FOUND);
    }
    const isDuplicateName = await this.findByName(customer.name);
    if (isDuplicateName && isDuplicateName.id !== id) {
      throw new HttpException(
        "The customer name already exists",
        HttpStatus.BAD_REQUEST
      );
    }

    // Merge the existing customer with the new data
    Object.assign(existingCustomer, customer);

    // Save the updated customer to the database
    return this.customerRepository.save(existingCustomer);
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
