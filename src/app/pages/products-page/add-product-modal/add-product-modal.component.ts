import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-add-product-modal',
    templateUrl: './add-product-modal.component.html',
    styleUrls: ['./add-product-modal.component.scss']
})
export class AddProductModalComponent implements OnInit {

    public modalRef!: BsModalRef;
    public form!: FormGroup;
    public submitted: boolean = false;
    @Input() isEditMode: boolean = false;
    @ViewChild('template') elementRef!: TemplateRef<any>;
    @Output() onAddProduct = new EventEmitter();
    @Output() onEditProduct = new EventEmitter();

    get f() {
        return this.form.controls;
    }

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            productName: this.formBuilder.control(null, { validators: Validators.required }),
            productDescription: this.formBuilder.control(null, { validators: Validators.required })
        });
    }

    public openModal(): void {
        this.modalRef = this.modalService.show(this.elementRef);
    }

    public openEditModal(productDeatils: any): void {
        this.f['productName'].setValue(productDeatils.name);
        this.f['productDescription'].setValue(productDeatils.description);
        this.modalRef = this.modalService.show(this.elementRef);
    }

    public hideModal(): void {
        if (this.modalRef) {
            this.modalRef.hide();
        }
    }

    public addProduct(): void {
        if (!this.form.valid) {
            this.submitted = true;
            console.log(this.f['productName'].errors)
            console.log(this.f['productDescription'].errors)
            return;
        }
        this.onAddProduct.emit(this.getFormValue());
        this.modalRef.hide();
    }

    public editProduct(): void {
        if (!this.form.valid) {
            return;
        }
        this.onEditProduct.emit(this.getFormValue());
        this.modalRef.hide();
    }

    private getFormValue(): any {
        const product = this.form.getRawValue();
        return product;
    }

}
