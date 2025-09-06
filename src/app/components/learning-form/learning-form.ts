import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This TypeScript class is similar to creating a helper class in Play Framework, where the
 * values and methods you define here can be used in the TypeScript code in the `.html` file.
 */
@Component({
    selector:    'app-learning-form',
    imports:     [ReactiveFormsModule, CommonModule], // Required modules for reactive forms and @if/@for
    templateUrl: './learning-form.html',
    styleUrl:    './learning-form.css'
})
export class LearningFormComponent implements OnInit, OnDestroy {

    // Used to clean up subscriptions when component is destroyed (prevents memory leaks).
    // `$` indicates that a variable contains an Observable or Subject.
    private readonly destroy$ = new Subject<void>();

    // The main form object that tracks all form fields and their state
    shippingForm: FormGroup;

    // Data arrays that populate dropdown/radio options in the template
    countries = [
        { code: 'US', name: 'United States',  shippingRate: 5 },
        { code: 'CA', name: 'Canada',         shippingRate: 8 },
        { code: 'UK', name: 'United Kingdom', shippingRate: 12 },
        { code: 'AU', name: 'Australia',      shippingRate: 15 },
        { code: 'JP', name: 'Japan',          shippingRate: 18 }
    ];

    // Each method has a multiplier that affects the final shipping cost
    shippingMethods = [
        { code: 'standard',  name: 'Standard (5-7 days)', multiplier: 1 },
        { code: 'express',   name: 'Express (2-3 days)',  multiplier: 1.5 },
        { code: 'overnight', name: 'Overnight',           multiplier: 3 }
    ];

    // Properties that store calculated values. These automatically update the template when changed.
    // Note that you don’t use `let` for class variables.
    calculatedShipping = 0;
    totalCost = 0;
    itemCost = 25.99;

    constructor(private formBuilder: FormBuilder) {
        this.shippingForm = this.formBuilder.group({
            country: ['', Validators.required],
            weight: [1, [Validators.required, Validators.min(0.1), Validators.max(50)]],
            shippingMethod: ['standard', Validators.required],
            insurance: [false],
            trackingNumber: ['']
        });
    }

    // Listen to specific field changes, do the necessary updates, with proper cleanup.
    ngOnInit(): void {
        this.shippingForm.get('country')     // 1. Get the 'country' FormControl from our FormGroup
            ?.valueChanges                   // 2. Access its `valueChanges` Observable (? = safe navigation operator)
            .pipe(takeUntil(this.destroy$))  // 3. Add RxJS operator: automatically unsubscribe when `destroy$` emits
            .subscribe(() => this.calculateShipping()); // 4. Subscribe to changes & run `calculateShipping()` when there is a change

        this.shippingForm.get('weight')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.calculateShipping());
        
        this.shippingForm.get('shippingMethod')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.calculateShipping();
                this.updateTrackingField();
            });
        
        this.shippingForm.get('insurance')?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.calculateShipping());
        
        // Initial calculation. `setTimeout` ensures this runs after the component is fully 
        // initialized and the form is ready. Without it, the form might not be completely set up yet.
        // `setTimeout` is JavaScript's function for "run this code after X milliseconds".
        // When you call `setTimeout` with 0 milliseconds (or no delay), it doesn't run immediately.
        // Instead, it puts the code at the end of the JavaScript event queue, meaning it runs after
        // all current synchronous code finishes. (Note: This is a common hack.)
        // Other approaches: use `afterNextRender` or `ngAfterViewInit` in nearly the same way.
        setTimeout(() => {
            this.calculateShipping();
            this.updateTrackingField();
        });
    }

    // `next()` is an unusual name, but Observers emit three types of signals:
    // 1: next (new data), 2: error (something broke), and 3: complete (all done).
    // `emit()` would be a better name.
    ngOnDestroy(): void {
        this.destroy$.next();      // File alarm (🔥): "EVERYONE STOP!" - broadcasts to all listeners
        this.destroy$.complete();
    }

    calculateShipping(): void {
        // Get current values directly from form controls
        const countryValue   = this.shippingForm.get('country')?.value;
        const weightValue    = this.shippingForm.get('weight')?.value;
        const methodValue    = this.shippingForm.get('shippingMethod')?.value;
        const insuranceValue = this.shippingForm.get('insurance')?.value;

        if (countryValue && weightValue && methodValue) {
            const country = this.countries.find(c => c.code === countryValue);
            const method  = this.shippingMethods.find(m => m.code === methodValue);

            if (country && method) {
                let shipping = country.shippingRate * weightValue * method.multiplier;
                
                if (insuranceValue) {
                    shipping += this.itemCost * 0.02;
                }
                
                this.calculatedShipping = Math.round(shipping * 100) / 100;
                this.totalCost = Math.round((this.itemCost + this.calculatedShipping) * 100) / 100;
            }
        } else {
            this.calculatedShipping = 0;
            this.totalCost = this.itemCost;
        }
    }

    updateTrackingField(): void {
        const methodValue     = this.shippingForm.get('shippingMethod')?.value;
        const trackingControl = this.shippingForm.get('trackingNumber');
        
        // `===` is the JS "strict equality" operator. It checks both type and value.
        // Always use `===` unless you have a reason not to.
        if (methodValue === 'standard') {
            // Standard shipping: disable and clear tracking
            if (trackingControl?.enabled) {
                trackingControl.disable({ emitEvent: false });
                trackingControl.setValue('', { emitEvent: false });
            }
        } else if (methodValue === 'express' || methodValue === 'overnight') {
            // Express/Overnight shipping: enable and generate tracking if empty
            if (trackingControl?.disabled) {
                trackingControl.enable({ emitEvent: false });
            }
            if (!trackingControl?.value) {
                const newTrackingNumber = 'TRK-' + Math.random().toString(36).substr(2, 8).toUpperCase();
                trackingControl?.setValue(newTrackingNumber, { emitEvent: false });
            }
        }
    }

    get country()        { return this.shippingForm.get('country'); }
    get weight()         { return this.shippingForm.get('weight'); }
    get shippingMethod() { return this.shippingForm.get('shippingMethod'); }
    get insurance()      { return this.shippingForm.get('insurance'); }
    get trackingNumber() { return this.shippingForm.get('trackingNumber'); }

    onSubmit(): void {
        if (this.shippingForm.valid) {
            console.log('Form submitted:', this.shippingForm.value);
            console.log('Calculated shipping:', this.calculatedShipping);
            console.log('Total cost:', this.totalCost);
        }
    }

    resetForm(): void {
        this.shippingForm.reset({
            country: '',
            weight: 1,
            shippingMethod: 'standard',
            insurance: false,
            trackingNumber: ''
        });
    }
}