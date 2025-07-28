from django.shortcuts import get_object_or_404, redirect, render

from ..models import Vendor


def vendors_index(request):
    '''Shows the vendor list'''
    vendors = Vendor.objects.all() # type: ignore
    context = {"vendors": vendors}
    return render(request=request, template_name="lovefi/vendor/index.html", context=context)

def vendor_create(request):
    '''Shows the vendor create form'''
    return render(request=request, template_name="lovefi/vendor/create.html")

def vendor_store(request):
    '''Handles form submission to create a vendor'''
    vendor = Vendor(
        name=request.POST['name']
    )
    vendor.save()
    return redirect('vendor_show', vendor_id=vendor.id) # type: ignore

def vendor_show(request, vendor_id):
    '''Shows the vendor details'''
    vendor = get_object_or_404(Vendor, pk=vendor_id)
    context = {"vendor": vendor}
    return render(request=request, template_name="lovefi/vendor/show.html", context=context)

def vendor_edit(request, vendor_id):
    '''Shows the vendor edit form'''
    vendor = get_object_or_404(Vendor, pk=vendor_id)
    context = {"vendor": vendor}
    return render(request=request, template_name="lovefi/vendor/edit.html", context=context)

def vendor_update(request, vendor_id):
    '''Handles form submission to update a vendor'''
    vendor = get_object_or_404(Vendor, pk=vendor_id)
    vendor.name = request.POST['name']
    vendor.save()
    return redirect('vendor_show', vendor_id=vendor_id)

def vendor_delete(request, vendor_id):
    '''Handles form submission to delete a vendor'''
    vendor = get_object_or_404(Vendor, pk=vendor_id)
    vendor.delete()
    return redirect('vendors_index')
